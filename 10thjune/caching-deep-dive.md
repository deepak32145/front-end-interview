# Caching Deep Dive — JS & CSS Files
**Interview focus:** HTTP caching, cache busting, Service Workers, CDN, real-world traps

---

## LAYER 1 — HTTP Cache Headers (The Foundation)

---

### C1. `Cache-Control` Directives — What Does Each One Actually Do?

**Ask the candidate to explain each directive:**

```http
Cache-Control: max-age=31536000, immutable
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: public, max-age=3600
Cache-Control: private, no-cache
Cache-Control: stale-while-revalidate=60, stale-if-error=86400
```

**Expected answers:**

| Directive | Meaning |
|-----------|---------|
| `max-age=N` | Cache is fresh for N seconds from response time |
| `immutable` | Tell browser: don't even bother revalidating during `max-age` window (even on hard reload in some browsers) |
| `no-cache` | **Widely misunderstood** — does NOT mean "don't cache". Means: cache it, but ALWAYS revalidate with the server before using (sends conditional request) |
| `no-store` | Truly don't store anywhere. No disk, no memory. Every request hits the server |
| `public` | CDNs and proxies may cache this response |
| `private` | Only the end-user's browser may cache. CDNs must not store it |
| `stale-while-revalidate=60` | Serve stale content for up to 60s while fetching fresh in the background |
| `stale-if-error=86400` | Serve stale content for up to 24h if the origin returns a 5xx error |

**Trap question:** What is the difference between `no-cache` and `no-store`?  
**Red flag answer:** "They both mean don't cache" — this is wrong and dangerously common.

---

### C2. Validation — ETag vs Last-Modified

**How does conditional caching work? Draw the full flow.**

```
First request:
  GET /app.js
  ← 200 OK
  ← ETag: "abc123"
  ← Last-Modified: Tue, 01 Jan 2026 00:00:00 GMT
  ← Cache-Control: no-cache

Second request (browser has cached copy):
  GET /app.js
  → If-None-Match: "abc123"
  → If-Modified-Since: Tue, 01 Jan 2026 00:00:00 GMT
  ← 304 Not Modified  (no body — saves bandwidth)
        OR
  ← 200 OK + new body + new ETag (if file changed)
```

**Ask:**
1. What does a `304` response save vs a `200`? *(Saves body transfer, but still one round trip)*
2. What is a **strong ETag** vs a **weak ETag**?
   - Strong: `"abc123"` — byte-for-byte identical
   - Weak: `W/"abc123"` — semantically equivalent, minor differences allowed
3. When would `Last-Modified` be unreliable?  
   *(Build systems regenerate timestamps even if content is identical; timestamp resolution is 1 second — two files built in the same second look identical)*

---

### C3. The `Vary` Header — The Hidden Complexity

**What does this header do?**
```http
Vary: Accept-Encoding
Vary: Accept-Language, Accept-Encoding
```

**Answer:** Tells caches that the response varies by these request headers. A CDN must store separate cached copies per unique combination.

**Trap:** What happens if you put `Vary: Cookie` on a JS file?  
**Answer:** Every unique cookie value gets its own CDN cache entry — effectively destroys CDN caching for that resource. Real-world bug that causes CDN cache-hit rate to drop to ~0%.

**Follow-up:** If you serve gzipped JS to browsers that support it and uncompressed to others, what `Vary` header do you need and why?  
```http
Vary: Accept-Encoding
```
Without this, a CDN might serve a gzipped response to a client that didn't send `Accept-Encoding: gzip`.

---

## LAYER 2 — Cache Busting Strategies

---

### C4. Filename Hashing vs Query String — Why It Matters

**Two approaches to cache busting:**
```
Approach A (Query String):
  /static/app.js?v=1.2.3
  /static/app.js?v=abc123

Approach B (Content Hash in Filename):
  /static/app.abc123def.js
  /static/app.xyz789ghi.js
```

**Which is better and why?**

| | Query String | Filename Hash |
|-|-------------|---------------|
| CDN caching | Some CDNs strip query strings by default — file gets cached as `/app.js` permanently | Full URL is different — CDN treats as new resource every time |
| Proxy/ISP caches | Historic proxies ignore query string for caching | Reliable everywhere |
| Rollback | Just change version string | Deploy old file, point to old hash |
| Long-lived cache headers | Risky — file can change without URL changing | Safe — URL only exists if content matches |

**Best practice:** Content hash in filename + `Cache-Control: max-age=31536000, immutable`  
**HTML entry point:** `Cache-Control: no-cache` (always revalidate — this is how new hashed filenames are discovered)

---

### C5. Webpack / Vite Chunking Strategy and Its Cache Impact

**What is the problem with this Webpack config?**
```js
// webpack.config.js
output: {
  filename: '[name].[contenthash].js',
}
```
```
Bundles produced:
  main.abc123.js   — your app code + React + lodash + everything
```

**Answer:** If you fix one typo in a button component, the entire bundle hash changes — users re-download React, lodash, everything.

**Correct strategy:**
```js
output: {
  filename: '[name].[contenthash].js',
},
optimization: {
  runtimeChunk: 'single',          // separate runtime manifest
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  },
},
```

**Result:**
```
vendors.a1b2c3.js    — React, lodash, etc. (changes rarely)
runtime.x1y2z3.js   — tiny webpack runtime/manifest (changes on every build)
main.f4g5h6.js      — your app code only
```

**Cache outcome:** Users cache `vendors.js` for a year. Only `main.js` and `runtime.js` re-download on each deploy.

**Ask:** Why do you need `runtimeChunk: 'single'`?  
**Answer:** Without it, the runtime (which contains the module ID map) is embedded in a chunk that otherwise wouldn't change — causing that chunk's hash to change on every build even if the code didn't.

---

### C6. The `immutable` Directive — When It Bites You

**Scenario:**
```http
Cache-Control: max-age=31536000, immutable
```
You deploy a critical bug fix to `/static/app.abc123.js` but forgot to change the hash (or the hash algorithm produced the same hash due to a build tool bug).

**Questions:**
1. What happens to users who already have this file cached?  
   *(They will serve the old buggy file for up to 1 year — `immutable` tells the browser not to revalidate even on hard refresh in some implementations)*
2. How do you force a fix?  
   - Change the file content so the hash changes (deploy a new `app.xyz789.js`)
   - If filename can't be changed: change the URL importing it (update HTML) — but HTML must not be cached with `immutable`
   - CDN purge helps CDN layer but NOT individual browser caches

**Core lesson:** `immutable` is a promise — only use it with content-hashed filenames where changing content guarantees a new URL.

---

## LAYER 3 — Service Worker Caching

---

### C7. Service Worker Cache Strategies — Which for What?

**Five strategies — candidate should name, explain, and give a use case:**

**1. Cache First (Cache Falling Back to Network)**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```
**Use case:** Versioned static assets (`app.abc123.js`). If it's in cache, serve instantly. Network only for new hashes.  
**Risk:** Stale content if cache isn't properly invalidated.

---

**2. Network First (Network Falling Back to Cache)**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
```
**Use case:** API calls where freshness matters, but offline fallback is acceptable.  
**Risk:** Slow on poor connections — always waits for network.

---

**3. Stale While Revalidate**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('v1').then(cache => {
      return cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetchPromise; // serve cached immediately, update in bg
      });
    })
  );
});
```
**Use case:** Non-critical assets like CSS, fonts, icons where slightly stale is fine.  
**Sweet spot:** Fast (serves from cache) + eventually consistent (updates silently).

---

**4. Cache Only**
```js
event.respondWith(caches.match(event.request));
```
**Use case:** Assets pre-cached during `install` event that never change.

---

**5. Network Only**
```js
event.respondWith(fetch(event.request));
```
**Use case:** Analytics, non-idempotent requests (POST), things that must never be cached.

---

### C8. Service Worker Lifecycle — The Update Trap

**What is the bug in this deployment flow?**
```
v1 SW installed, controlling the page
Deploy v2 of your app with a new SW
User visits the page — browser downloads new SW
New SW is installed but NOT activated
User still sees v1
```

**Why?** A new SW waits until ALL tabs/windows running the old SW are closed before activating. If a user has the app open in multiple tabs for weeks, they never get the update.

**Solutions:**
```js
// In the new service worker:
self.addEventListener('install', event => {
  self.skipWaiting(); // activate immediately, don't wait for old tabs to close
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // take control of open pages immediately
});
```

**Trap:** `skipWaiting()` can cause a version mismatch within a single page load — old page code + new SW cache. Ask candidate: when would you NOT use `skipWaiting`?  
*(When the new SW serves files incompatible with the old app's runtime — could cause JS errors mid-session)*

---

### C9. Cache Versioning & Cleanup in Service Workers

**What is the problem?**
```js
const CACHE_NAME = 'my-cache-v1';

self.addEventListener('activate', event => {
  // nothing here
});
```

**Answer:** Old caches from previous SW versions accumulate indefinitely, consuming disk space.

**Correct pattern:**
```js
const CACHE_NAME = 'my-cache-v3';
const VALID_CACHES = [CACHE_NAME];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => !VALID_CACHES.includes(name))
          .map(name => caches.delete(name))
      )
    )
  );
});
```

**Follow-up:** If you increment `CACHE_NAME` to `v4`, what happens to users on `v3`?  
*(On next SW activation, `v3` cache is deleted. But between install and activate, both `v3` SW and `v4` SW may be alive simultaneously — this is the waiting state.)*

---

## LAYER 4 — CDN Caching

---

### C10. CDN Cache Invalidation — The Hard Problem

**"There are only two hard things in Computer Science: cache invalidation and naming things."**

**Scenario:** You deploy a critical security fix to `app.js`. Your CDN has it cached with `max-age=86400`. How do you handle it?

**Approaches:**
1. **Content-hashed filenames** — new file = new URL = CDN has no stale entry. Best approach.
2. **CDN purge API** — most CDNs (CloudFront, Cloudflare, Fastly) have purge APIs. Invalidate the specific path.
   - Problem: takes time to propagate globally (~seconds to minutes)
   - CloudFront charges per invalidation after first 1000/month
3. **Surrogate keys / Cache tags** — tag resources with logical names (`tag: app-js`), purge by tag. Fastly/Cloudflare support this.
4. **URL versioning** — change query string or path. Only works if CDN is configured to cache by full URL.

**Ask:** What is the difference between a CDN purge and a browser cache invalidation?  
**Answer:** CDN purge clears the CDN's copy — next user gets a fresh fetch from origin. It does NOT clear the file already saved in the individual user's browser cache. A user who cached `app.js` for 24h will still serve the old file from their browser for the remaining time.

---

### C11. Cache-Control for HTML vs JS/CSS — The Strategy

**What are the correct cache headers for each file type in a production SPA and why?**

```
index.html:
  Cache-Control: no-cache
  (or: max-age=0, must-revalidate)

app.[hash].js:
  Cache-Control: public, max-age=31536000, immutable

vendor.[hash].js:
  Cache-Control: public, max-age=31536000, immutable

app.[hash].css:
  Cache-Control: public, max-age=31536000, immutable

/api/* responses:
  Cache-Control: private, no-cache
  (or appropriate max-age with stale-while-revalidate)
```

**Why `no-cache` for HTML?**  
HTML is the **bootstrap document** — it references all hashed JS/CSS filenames. If HTML is cached long-term, users never discover new `app.xyz.js` filenames on deployment. `no-cache` means: cache it, but always check if it's changed (304 is fast, minimal overhead).

**The cascade:**
```
Browser loads index.html (always fresh via no-cache)
  └── index.html references app.abc123.js (new hash after deploy)
       └── Browser downloads new JS (old vendor.js still cached = zero cost)
```

---

## LAYER 5 — Tricky Scenarios & Edge Cases

---

### C12. The Split-Brain Deploy Problem

**Scenario:** You have a React SPA. You deploy a new version. During the 30-second deployment window, some users get the new `index.html` but old `app.js` is still being served, or vice versa.

**Questions:**
1. What error does the user see?  
   *(Likely a JS parse error or "module not found" if chunks are split and old chunks are deleted)*
2. How do you prevent this?  
   - **Keep old assets around** for at least N minutes/hours after deploy (or indefinitely, since they're content-hashed and storage is cheap)
   - Blue-green deployments: switch traffic atomically
   - Service Worker can pin a consistent version of all assets

---

### C13. CSS `@import` and Caching Cascades

**What is the performance problem?**
```css
/* main.css */
@import url('base.css');
@import url('components.css');
@import url('theme.css');
```

**Answer:** CSS `@import` creates **sequential waterfall** requests:
```
Request main.css
  → Parse, discover @import
  → Request base.css
    → Parse, discover @import
    → Request components.css ...
```
Each import blocks render. Browser can't discover imports until the parent file is fully downloaded and parsed.

**Fix:** Use build tools (PostCSS, Sass, Vite) to bundle all CSS into one file, or use multiple `<link>` tags in HTML which load in parallel.

**Follow-up:** How does HTTP/2 change this calculus?  
*(HTTP/2 multiplexes multiple requests over one connection — parallel requests have near-zero overhead. But the parse-then-discover waterfall still exists for `@import`, regardless of HTTP version.)*

---

### C14. `preload`, `prefetch`, `modulepreload` — Caching Interaction

**What does each hint do and how does it interact with the cache?**
```html
<link rel="preload" href="hero.jpg" as="image">
<link rel="prefetch" href="/about.chunk.js">
<link rel="modulepreload" href="/app.abc123.js">
```

| Hint | Priority | When | Cache |
|------|----------|------|-------|
| `preload` | High | Current page needs it soon | Browser cache — same entry as normal fetch |
| `prefetch` | Idle | Future navigation might need it | Stored in prefetch cache (may be separate from HTTP cache in some browsers) |
| `modulepreload` | High | ES module on current page | Module map — also evaluates module dependencies, unlike `preload` |

**Trap:** If you `preload` a font but don't use it within 3 seconds, Chrome will warn "preloaded resource was not used." Misuse wastes bandwidth.

**Follow-up:** What happens if you `preload` a resource with credentials but the actual fetch is cross-origin without credentials?  
*(Double fetch — browser treats them as different resources. Must match `crossorigin` attribute.)*

---

### C15. Real-World Debugging — The Cache Poisoning Scenario

**Scenario:** Users are occasionally seeing a mix of old and new CSS after a deploy. Some users see broken styles for hours. How do you debug and fix this?

**Systematic debugging approach:**
1. Check `Cache-Control` headers on CSS files — are they content-hashed?
2. Check HTML `Cache-Control` — is it `no-cache`? If cached with long TTL, users load old HTML pointing to old CSS filename
3. Check CDN configuration — is the CDN stripping query strings? Is it caching `index.html`?
4. Check for `Vary: Accept-Encoding` — if missing, CDN may serve gzipped CSS to a client that can't decompress
5. Check Service Worker — is there a stale SW with old cached assets that isn't being updated?
6. Check if old hashed files are deleted immediately on deploy (split-brain problem)

**Tools:**
- `curl -I https://yoursite.com/app.js` — inspect actual response headers from CDN
- CDN analytics dashboard — cache hit/miss ratio, TTL
- Chrome DevTools → Network tab → right-click request → "Copy as cURL" → check `age` header (seconds since CDN cached it)
- `age` header: `Age: 3600` means the CDN has been serving this cached copy for 1 hour

---

## Summary — The Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     CACHING LAYERS (outermost → user)           │
│                                                                 │
│  Origin Server                                                  │
│      ↓                                                          │
│  CDN Edge Cache  ←── Cache-Control: public, max-age, immutable  │
│      ↓                                                          │
│  ISP / Proxy Cache                                              │
│      ↓                                                          │
│  Browser HTTP Cache ←── ETag, Last-Modified, max-age            │
│      ↓                                                          │
│  Service Worker Cache API ←── Custom strategies                 │
│      ↓                                                          │
│  Browser Memory Cache (in-page, same session)                   │
│      ↓                                                          │
│  JavaScript running on page                                      │
└─────────────────────────────────────────────────────────────────┘

Rule for JS/CSS:
  HTML         → no-cache (always fresh, discovers new hashed filenames)
  Hashed JS/CSS → max-age=31536000, immutable (cache forever, new hash = new URL)
  API responses → private, no-cache or short max-age with stale-while-revalidate
```

---

## Quick-Fire Questions (Last 10 Minutes)

1. What does `Age: 7200` in a response header mean?  
   *(The CDN has been serving this cached copy for 2 hours; effective freshness = max-age - age)*

2. Can a browser cache a `POST` response?  
   *(No, by default. POST is not idempotent. Only `GET`/`HEAD` are cacheable by default.)*

3. What does `must-revalidate` add over `max-age` alone?  
   *(Without it, a stale response MAY still be served in degraded conditions. `must-revalidate` means: if stale, you MUST revalidate — never serve stale even if offline.)*

4. What is cache stampede / thundering herd?  
   *(When a cached item expires and thousands of simultaneous requests all hit the origin at once. Fix: probabilistic early expiry, locking/coalescing at CDN/proxy layer.)*

5. What is the difference between `s-maxage` and `max-age`?  
   *(`s-maxage` overrides `max-age` for shared caches (CDNs, proxies) only. Browser ignores `s-maxage`.)*

6. A user presses Ctrl+Shift+R (hard reload). Which caches does it bypass?  
   *(Hard reload bypasses browser HTTP cache for the main document and sends `Cache-Control: no-cache` on sub-resource requests. Does NOT bypass Service Worker cache unless DevTools is open with "Bypass for network" checked.)*
