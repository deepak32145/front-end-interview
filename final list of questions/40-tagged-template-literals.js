/**
 * Q40: Tagged Template Literals — Beyond Basic Interpolation
 * Difficulty: Hard
 * Concepts: tag function signature, raw vs cooked strings, building a safe HTML/SQL escaping helper, memoized template caching
 */

// ============================================
// QUESTION
// ============================================
/*
1) Explain the EXACT arguments a tag function receives. What is the
   difference between `strings` and `strings.raw`?

function tag(strings, ...values) {
  console.log(strings, strings.raw, values);
}
tag`Hello ${1 + 1}\nWorld ${'!'}`;

2) Implement `html` as a tagged template that auto-escapes interpolated
   values (to prevent XSS) EXCEPT when a value is wrapped in a special
   `safe(str)` marker (meaning "trust this, don't escape it").

3) Implement `sql` as a tagged template that builds a parameterized
   query string + params array (for a hypothetical DB driver), NEVER
   directly interpolating values into the query string (SQL injection
   prevention) — e.g.:

const query = sql`SELECT * FROM users WHERE id = ${userId} AND name = ${name}`;
// query.text === 'SELECT * FROM users WHERE id = $1 AND name = $2'
// query.values === [userId, name]
*/

// ============================================
// ANSWERS
// ============================================

/*
1) A tag function receives:
   - `strings`: an array of the LITERAL text segments BETWEEN the
     interpolations (`strings.length === values.length + 1` always).
     It also has a `.raw` property.
   - `strings.raw`: the SAME segments but with escape sequences (like
     `\n`, `\t`) LEFT UN-PROCESSED as literal backslash-n characters,
     rather than converted to actual newline characters. `strings[i]`
     gives you the "cooked" (processed) version; `strings.raw[i]` gives
     you exactly what was typed in the source, character for character.
   - `...values`: the evaluated results of each `${...}` expression, in
     order.

   For `tag\`Hello ${1+1}\nWorld ${'!'}\``:
   strings      = ["Hello ", "\nWorld ", ""]   (cooked: real newline char)
   strings.raw  = ["Hello ", "\\nWorld ", ""]  (raw: literal backslash+n,
                                                  two characters)
   values       = [2, "!"]
*/

const SAFE = Symbol('safe-html');

function safe(str) {
  return { [SAFE]: true, toString: () => str };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const rawValue = values[i - 1];
    const isSafe = rawValue && typeof rawValue === 'object' && rawValue[SAFE];
    const insertedValue = i === 0 ? '' : (isSafe ? String(rawValue) : escapeHtml(rawValue));
    return result + insertedValue + str;
  });
}

/*
TEST:
const userInput = '<script>alert(1)</script>';
const trustedWidget = safe('<b>bold</b>');

console.log(html`<div>${userInput}</div>`);
// <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>

console.log(html`<div>${trustedWidget}</div>`);
// <div><b>bold</b></div>   (NOT escaped, because wrapped in safe())
*/

function sql(strings, ...values) {
  const text = strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ''),
    ''
  );
  return { text, values };
}

/*
TEST:
const userId = 42;
const name = "Robert'); DROP TABLE users;--";
const query = sql`SELECT * FROM users WHERE id = ${userId} AND name = ${name}`;
console.log(query.text);
// SELECT * FROM users WHERE id = $1 AND name = $2
console.log(query.values);
// [42, "Robert'); DROP TABLE users;--"]
// The malicious string is safely passed as a PARAMETER, never spliced
// into the query text itself — the actual driver would send `text` and
// `values` separately to the database, which handles escaping
// correctly at the protocol level. This is exactly how libraries like
// `sql-template-strings` and Prisma's `$queryRaw` tagged templates work
// under the hood.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly explains strings vs strings.raw with a concrete example
  involving an escape sequence.
- html() escapes by default and correctly special-cases a "trusted"
  wrapper without executing arbitrary bypass logic.
- sql() NEVER concatenates raw values into the query string — this is
  the entire point (parameterized queries prevent injection structurally,
  not via escaping heuristics).
- Recognizes this pattern (tag functions returning structured data
  instead of plain strings) as the foundation of libraries like
  styled-components, graphql-tag, and various safe-SQL libraries.
*/
