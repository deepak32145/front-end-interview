/**
 * HTML & CSS INTERVIEW QUESTIONS
 * Front-end Interview Series
 */

// ============================================
// QUESTION 1: HTML Semantic Structure
// ============================================
/*
QUESTION:
Create a semantic HTML structure for a blog article page.
Include: header, navigation, main content with article, sidebar, and footer.
Explain why semantic HTML matters.

REQUIREMENTS:
- Use semantic elements (header, nav, article, aside, footer, section)
- Proper heading hierarchy (h1, h2, h3)
- Accessibility attributes (alt text, aria labels)
- Meta information and SEO tags
*/

// CORRECT SOLUTION:
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Blog about web development">
  <title>Web Development Blog</title>
</head>
<body>
  <header>
    <h1>My Tech Blog</h1>
    <p>Exploring web technologies</p>
  </header>
  
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  
  <main>
    <article>
      <header>
        <h2>Understanding CSS Grid</h2>
        <time datetime="2024-01-15">January 15, 2024</time>
        <p>By <span class="author">John Doe</span></p>
      </header>
      
      <section>
        <h3>Introduction</h3>
        <p>CSS Grid is a powerful layout system...</p>
      </section>
      
      <section>
        <h3>Grid Fundamentals</h3>
        <p>Grid consists of rows and columns...</p>
      </section>
      
      <footer>
        <p>Tags: <a href="#css">CSS</a>, <a href="#layout">Layout</a></p>
      </footer>
    </article>
    
    <aside>
      <h3>Recent Posts</h3>
      <ul>
        <li><a href="#">Flexbox Basics</a></li>
        <li><a href="#">CSS Variables</a></li>
      </ul>
    </aside>
  </main>
  
  <footer>
    <p>&copy; 2024 My Tech Blog. All rights reserved.</p>
  </footer>
</body>
</html>
*/

/*
EVALUATION CRITERIA:
✓ Uses semantic HTML elements appropriately
✓ Proper heading hierarchy (h1 > h2 > h3)
✓ Meta tags for SEO and viewport
✓ Accessibility attributes (alt, aria-label)
✓ Proper nesting of elements
✓ Time element for publishing date
✓ Explains importance (SEO, accessibility, maintainability)
*/


// ============================================
// QUESTION 2: CSS Flexbox vs Grid
// ============================================
/*
QUESTION:
Create a responsive layout using Flexbox.
Create the same layout using CSS Grid.
Explain when to use each.

LAYOUT REQUIREMENTS:
- Header spanning full width
- Sidebar (250px fixed) + Main content area
- Footer spanning full width
- Responsive: Stack sidebar below main on mobile
*/

// FLEXBOX SOLUTION:
/*
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Arial, sans-serif;
  }
  
  header {
    background: #333;
    color: white;
    padding: 20px;
    flex: 0 0 auto;
  }
  
  main {
    display: flex;
    flex: 1 1 auto;
    gap: 20px;
    padding: 20px;
  }
  
  aside {
    flex: 0 0 250px;
    background: #f5f5f5;
    padding: 20px;
  }
  
  article {
    flex: 1 1 auto;
    background: white;
    padding: 20px;
  }
  
  footer {
    background: #333;
    color: white;
    padding: 20px;
    text-align: center;
    flex: 0 0 auto;
  }
  
  // Mobile responsive
  @media (max-width: 768px) {
    main {
      flex-direction: column;
    }
    
    aside {
      flex: 0 0 auto;
      width: 100%;
    }
  }
</style>
*/

// GRID SOLUTION:
/*
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
    gap: 20px;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  header {
    grid-column: 1 / -1;
    background: #333;
    color: white;
    padding: 20px;
  }
  
  aside {
    background: #f5f5f5;
    padding: 20px;
    grid-row: 2;
    grid-column: 1;
  }
  
  article {
    background: white;
    padding: 20px;
    grid-row: 2;
    grid-column: 2;
  }
  
  footer {
    grid-column: 1 / -1;
    background: #333;
    color: white;
    padding: 20px;
    text-align: center;
  }
  
  // Mobile responsive
  @media (max-width: 768px) {
    body {
      grid-template-columns: 1fr;
    }
    
    aside {
      grid-row: auto;
      grid-column: 1;
    }
    
    article {
      grid-row: auto;
      grid-column: 1;
    }
  }
</style>
*/

/*
WHEN TO USE FLEXBOX:
- One-dimensional layouts (rows OR columns)
- Navigation bars, toolbars
- Centering content
- Wrapping components
- Equal height elements in a row

WHEN TO USE GRID:
- Two-dimensional layouts (rows AND columns)
- Page layouts (header, sidebar, content, footer)
- Complex dashboard layouts
- Explicit positioning needed
- When you need control over both axes

EVALUATION CRITERIA:
✓ Correct Flexbox implementation
✓ Correct Grid implementation
✓ Responsive design with media queries
✓ Proper gap/spacing
✓ Explains differences clearly
✓ Knows trade-offs of each approach
*/


// ============================================
// QUESTION 3: CSS Styling and Specificity
// ============================================
/*
QUESTION:
Explain CSS specificity and cascade. Fix the specificity problem below:
*/

// PROBLEM CODE:
/*
<style>
  div {
    color: blue;
  }
  
  .container div {
    color: red;  // This should apply
  }
  
  div.item {
    color: green; // This has same specificity as below
  }
  
  .container > div {
    color: yellow; // This overrides the above
  }
</style>

<div class="container">
  <div class="item">Text</div>
</div>
*/

// SOLUTION & EXPLANATION:
/*
Specificity calculation (a, b, c, d):
- a = inline styles (style="")
- b = ID selectors (#id)
- c = class selectors (.class), attributes ([attr]), pseudo-classes (:hover)
- d = element selectors (div, p, etc.)

SPECIFICITY SCORES:
- div: (0, 0, 0, 1)
- .container div: (0, 0, 1, 1) ← Higher specificity wins!
- div.item: (0, 0, 1, 1) ← Same as above
- .container > div: (0, 0, 1, 1) ← All three have same specificity!

RULES:
1. Inline styles (style="") have highest priority
2. !important can override, but should be avoided
3. Later rules override earlier ones when specificity is equal
4. More specific selectors always win

BEST PRACTICES:
- Avoid using !important
- Don't nest selectors unnecessarily
- Keep specificity low and consistent
- Use BEM or similar naming conventions
*/

// CORRECT IMPLEMENTATION:
/*
<style>
  div {
    color: blue;
  }
  
  .container div {
    color: red;
  }
  
  .container .item {
    color: green; // More specific than .container div
  }
  
  .container .item.active {
    color: yellow; // (0, 0, 2, 0) - Higher specificity
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Correctly calculates specificity scores
✓ Understands cascade and inheritance
✓ Explains why certain styles win
✓ Knows about !important (and why to avoid it)
✓ Best practices for managing specificity
✓ Can debug style conflicts
*/


// ============================================
// QUESTION 4: CSS Positioning and Layering
// ============================================
/*
QUESTION:
Explain CSS positioning (static, relative, absolute, fixed, sticky).
Create a modal dialog with overlay using positioning.
*/

// SOLUTION:
/*
<style>
  // Static (default)
  .static-element {
    position: static; // Follows normal document flow
  }
  
  // Relative
  .relative-element {
    position: relative;
    top: 10px;
    left: 20px;
    // Still takes up space in document flow
    // Positioned relative to its normal position
  }
  
  // Absolute
  .container {
    position: relative; // Establishes positioning context
  }
  
  .absolute-element {
    position: absolute;
    top: 50px;
    left: 0;
    // Removed from document flow
    // Positioned relative to nearest positioned ancestor
  }
  
  // Fixed
  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    // Positioned relative to viewport
    // Stays in place on scroll
  }
  
  // Sticky
  .sticky-header {
    position: sticky;
    top: 0;
    // Behaves like relative until scrolled to position
    // Then behaves like fixed
  }
  
  // Modal Implementation
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-dialog {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    z-index: 1001;
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
  }
</style>

<div class="modal-overlay" id="modal">
  <div class="modal-dialog">
    <span class="modal-close">&times;</span>
    <h2>Modal Title</h2>
    <p>Modal content goes here</p>
    <button>Close</button>
  </div>
</div>
*/

/*
POSITIONING SUMMARY:
- static: Default, normal flow
- relative: Relative to normal position, takes up space
- absolute: Relative to positioned ancestor, removed from flow
- fixed: Relative to viewport, stays on scroll
- sticky: Hybrid of relative and fixed

z-index: Controls stacking order (higher = on top)
- Only works with positioned elements (not static)
- Creates stacking context

EVALUATION CRITERIA:
✓ Explains all positioning types
✓ Understands difference between relative/absolute/fixed
✓ Uses z-index correctly
✓ Modal implementation is functional
✓ Proper stacking context understanding
*/


// ============================================
// QUESTION 5: Responsive Design and Media Queries
// ============================================
/*
QUESTION:
Create a responsive card grid that adapts from 1 column on mobile
to 4 columns on desktop using:
1. Media queries
2. CSS Grid with auto-fit
3. CSS Container Queries (modern)

BREAKPOINTS:
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: 1024px+ (4 columns)
*/

// SOLUTION 1: Traditional Media Queries
/*
<style>
  .card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (min-width: 768px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
*/

// SOLUTION 2: Modern CSS Grid with auto-fit
/*
<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  // Automatically adapts based on available space!
</style>
*/

// SOLUTION 3: CSS Container Queries (Newer approach)
/*
<style>
  .card-container {
    container-type: inline-size;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 20px;
  }
  
  @container (min-width: 500px) {
    .card {
      padding: 30px;
    }
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Understands mobile-first design
✓ Correct media query syntax
✓ Uses proper breakpoints
✓ Knows auto-fit and minmax()
✓ Familiar with container queries
✓ Responsive without unnecessary queries
*/


// ============================================
// QUESTION 6: CSS Transitions and Animations
// ============================================
/*
QUESTION:
Create a button with hover effect using:
1. CSS Transitions
2. CSS Animations
Include smooth color change, scale, and shadow effects.
*/

// SOLUTION 1: Transitions
/*
<style>
  .button {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    
    // Transition properties
    transition: all 0.3s ease-in-out;
  }
  
  .button:hover {
    background: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .button:active {
    transform: scale(0.98);
  }
</style>
*/

// SOLUTION 2: Animations
/*
<style>
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
    }
  }
  
  .button {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    animation: slideIn 0.5s ease-in-out;
  }
  
  .button:hover {
    animation: pulse 1s infinite;
  }
</style>
*/

/*
TRANSITION VS ANIMATION:
- Transitions: Triggered by state changes (hover, active)
- Animations: Self-contained, can loop, more complex
- Performance: Use transform and opacity for best performance
- Avoid animating: width, height, left, top (use transform instead)

EVALUATION CRITERIA:
✓ Correct transition syntax
✓ Correct @keyframes syntax
✓ Smooth performance
✓ Uses transform/opacity (not expensive properties)
✓ Proper timing functions (ease, ease-in-out)
✓ Understands animation vs transition
*/


// ============================================
// QUESTION 7: CSS Variables and Preprocessing
// ============================================
/*
QUESTION:
Create a reusable color scheme using CSS Variables.
Implement light and dark mode toggle.
*/

// SOLUTION with CSS Variables:
/*
<style>
  // Define custom properties
  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --danger-color: #dc3545;
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-radius: 4px;
    --transition-duration: 0.3s;
  }
  
  // Dark mode
  :root.dark-mode {
    --primary-color: #0d6efd;
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
  
  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: var(--transition-duration);
  }
  
  .button {
    background: var(--primary-color);
    border-radius: var(--border-radius);
    transition: var(--transition-duration);
  }
  
  .button.danger {
    background: var(--danger-color);
  }
  
  .card {
    background: var(--bg-color);
    color: var(--text-color);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>

<script>
  // Toggle dark mode
  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', 
      document.documentElement.classList.contains('dark-mode')
    );
  }
  
  // Load saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark-mode');
  }
</script>
*/

/*
BENEFITS OF CSS VARIABLES:
- DRY (Don't Repeat Yourself)
- Easy theme switching
- Dynamic updates via JavaScript
- Cascading and inheritance
- Better maintainability

EVALUATION CRITERIA:
✓ Correctly declares CSS variables
✓ Proper syntax with --variable-name
✓ Uses var() function correctly
✓ Dark mode implementation works
✓ Understands scope (:root vs element)
✓ Can update CSS variables with JS
*/


// ============================================
// QUESTION 8: Web Accessibility (a11y)
// ============================================
/*
QUESTION:
Create an accessible form with proper labels, error handling,
and ARIA attributes for screen readers.
*/

// SOLUTION:
/*
<form id="contact-form" aria-label="Contact Form" novalidate>
  <div class="form-group">
    <label for="name">
      Full Name 
      <span aria-label="required">*</span>
    </label>
    <input 
      type="text"
      id="name"
      name="name"
      required
      aria-required="true"
      aria-describedby="name-error"
    >
    <span id="name-error" class="error" role="alert"></span>
  </div>
  
  <div class="form-group">
    <label for="email">
      Email Address
      <span aria-label="required">*</span>
    </label>
    <input 
      type="email"
      id="email"
      name="email"
      required
      aria-required="true"
      aria-describedby="email-error email-hint"
    >
    <small id="email-hint">We'll never share your email</small>
    <span id="email-error" class="error" role="alert"></span>
  </div>
  
  <div class="form-group">
    <fieldset>
      <legend>What's your experience level?</legend>
      <div class="radio-group">
        <input type="radio" id="beginner" name="level" value="beginner">
        <label for="beginner">Beginner</label>
        
        <input type="radio" id="intermediate" name="level" value="intermediate">
        <label for="intermediate">Intermediate</label>
        
        <input type="radio" id="expert" name="level" value="expert">
        <label for="expert">Expert</label>
      </div>
    </fieldset>
  </div>
  
  <button type="submit" aria-busy="false" id="submit-btn">
    Submit <span class="spinner" aria-hidden="true"></span>
  </button>
</form>

<style>
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  input:invalid {
    border-color: #dc3545;
  }
  
  .error {
    color: #dc3545;
    display: block;
    margin-top: 4px;
  }
  
  small {
    color: #6c757d;
    display: block;
    margin-top: 4px;
  }
  
  fieldset {
    border: none;
    padding: 0;
  }
  
  legend {
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .radio-group {
    display: flex;
    gap: 20px;
  }
  
  // High contrast mode
  @media (prefers-contrast: more) {
    input {
      border-width: 3px;
    }
  }
  
  // Reduced motion
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
*/

/*
ACCESSIBILITY BEST PRACTICES:
- Proper label associations with for="id"
- aria-required, aria-describedby for form elements
- role="alert" for error messages
- Sufficient color contrast
- Keyboard navigation support
- Focus indicators
- Respect prefers-reduced-motion
- ARIA attributes when semantic HTML isn't enough

EVALUATION CRITERIA:
✓ Proper form labels and associations
✓ ARIA attributes used correctly
✓ Error states clearly marked
✓ Keyboard navigation support
✓ Focus visible (not hidden)
✓ Color contrast sufficient
✓ Understands a11y principles
*/


// ============================================
// QUESTION 9: CSS Best Practices and Performance
// ============================================
/*
QUESTION:
Identify performance issues and best practices in the CSS code below.
Explain browser rendering and reflow/repaint.
*/

// PROBLEMATIC CODE:
/*
<style>
  .box {
    width: 100px;
    height: 100px;
  }
  
  .box:hover {
    width: 120px;      // Triggers reflow
    height: 120px;     // Triggers reflow
    left: 50px;        // Triggers reflow
    box-shadow: 0 0 10px black; // Triggers repaint
  }
  
  .animated {
    position: relative;
    animation: move 1s infinite;
  }
  
  @keyframes move {
    from { left: 0; }   // Expensive - causes reflow
    to { left: 100px; }
  }
</style>
*/

// OPTIMIZED SOLUTION:
/*
<style>
  .box {
    width: 100px;
    height: 100px;
    // Use transform instead of width/height changes
  }
  
  .box:hover {
    transform: scale(1.2);  // No reflow - GPU accelerated
    box-shadow: 0 0 10px black;
  }
  
  .animated {
    animation: move 1s infinite;
  }
  
  @keyframes move {
    from { 
      transform: translateX(0);  // Efficient
    }
    to { 
      transform: translateX(100px);  // Efficient
    }
  }
  
  // Other performance considerations:
  
  // Good: Use will-change sparingly
  .will-animate {
    will-change: transform;
  }
  
  // Bad: Don't over-use will-change
  // .every-element { will-change: *; } // DON'T DO THIS
  
  // Good: Use contain to isolate layout
  .contained {
    contain: layout style paint;
  }
</style>
*/

/*
BROWSER RENDERING PIPELINE:
1. Parse HTML → DOM
2. Parse CSS → CSSOM
3. Combine → Render Tree
4. Layout (Reflow) → Calculate positions
5. Paint (Repaint) → Draw pixels
6. Composite → Combine layers

EXPENSIVE OPERATIONS (cause reflow):
- width, height, position, left, top, bottom, right
- margin, padding, border
- display, visibility
- Reading computed styles

PERFORMANCE TIPS:
✓ Use transform and opacity for animations
✓ Use will-change for GPU acceleration
✓ Batch DOM changes
✓ Use requestAnimationFrame
✓ Minimize specificity
✓ Avoid inline styles
✓ Use CSS contain for isolation

EVALUATION CRITERIA:
✓ Identifies reflow vs repaint
✓ Uses transform instead of position changes
✓ Understands GPU acceleration
✓ Knows which properties are expensive
✓ Performance-conscious CSS writing
*/


// ============================================
// QUESTION 10: White-space and Text Handling
// ============================================
/*
QUESTION:
Deep dive into CSS text and whitespace properties.
Control text wrapping, overflow, and rendering.
*/

// WHITESPACE PROPERTY
/*
<style>
  .pre {
    white-space: pre;
    // Preserves all whitespace and newlines
  }
  
  .nowrap {
    white-space: nowrap;
    // No line breaks, text overflows
  }
  
  .prewrap {
    white-space: pre-wrap;
    // Preserves whitespace but wraps text
  }
  
  .normal {
    white-space: normal;
    // Default - collapses whitespace, wraps normally
  }
</style>
*/

// TEXT OVERFLOW HANDLING
/*
<style>
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // Single line with ellipsis
  }
  
  .multiline-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    // 3 lines with ellipsis
  }
  
  .text-wrap {
    word-break: break-word;
    // Break long words
  }
  
  .hyphenation {
    hyphens: auto;
    // Enable hyphenation
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ White-space property values
✓ Text overflow handling
✓ Ellipsis for long text
✓ Line clamp for multi-line text
✓ Word breaking strategies
✓ Hyphenation support
✓ Various text rendering scenarios
*/


// ============================================
// QUESTION 11: Writing Modes and Text Direction
// ============================================
/*
QUESTION:
Handle different writing modes and directions (RTL, vertical text).
*/

// WRITING MODE
/*
<style>
  .vertical-rl {
    writing-mode: vertical-rl;
    // Right to left, vertical
  }
  
  .vertical-lr {
    writing-mode: vertical-lr;
    // Left to right, vertical
  }
  
  .horizontal {
    writing-mode: horizontal-tb;
    // Default - horizontal, top to bottom
  }
  
  // DIRECTION FOR RTL
  .rtl {
    direction: rtl;
    // Right to left text direction
    text-align: right;
  }
  
  .ltr {
    direction: ltr;
    // Left to right (default)
  }
  
  // LOGICAL PROPERTIES (works with any direction)
  .logical {
    padding-inline-start: 20px;
    // Padding at start (right in RTL, left in LTR)
    margin-block-start: 10px;
    // Margin at block start
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Writing mode values
✓ Direction property (LTR/RTL)
✓ Logical properties (inline/block)
✓ International text support
✓ Proper text alignment with direction
*/


// ============================================
// QUESTION 12: Stacking Context and Z-index
// ============================================
/*
QUESTION:
Understand stacking context and when z-index applies.
Solve z-index conflicts.
*/

// STACKING CONTEXT CREATION
/*
<style>
  /* These create stacking contexts: */
  .context1 {
    position: relative;
    z-index: 1;
    // Creates stacking context because z-index is not auto
  }
  
  .context2 {
    opacity: 0.5;
    // Creates stacking context because opacity < 1
  }
  
  .context3 {
    transform: scale(1.1);
    // Creates stacking context
  }
  
  .context4 {
    filter: blur(5px);
    // Creates stacking context
  }
  
  /* Stacking order within context: */
  /* 1. Background and borders */
  /* 2. Negative z-index children */
  /* 3. Block-level children */
  /* 4. Floated children */
  /* 5. Inline children */
  /* 6. Zero z-index / auto z-index children */
  /* 7. Positive z-index children */
  
  .no-context {
    position: static;
    // z-index ignored, not in context
  }
</style>

COMMON MISTAKE:
Parent with z-index: 1 creates stacking context.
Parent's z-index 1 > Child's z-index 9999
The child can never go above siblings of parent.

SOLUTION:
Remove z-index from parent OR
Restructure HTML so element isn't nested.
*/

/*
EVALUATION CRITERIA:
✓ What creates stacking contexts
✓ Stacking order
✓ Why z-index doesn't work as expected
✓ Solutions for stacking conflicts
✓ Opacity and transform effects
*/


// ============================================
// QUESTION 13: Custom Properties (CSS Variables)
// ============================================
/*
QUESTION:
Advanced CSS variable patterns for theming and responsive design.
*/

// BASIC CUSTOM PROPERTIES
/*
<style>
  :root {
    --primary: #007bff;
    --secondary: #6c757d;
    --danger: #dc3545;
    --spacing-unit: 8px;
    --button-padding: calc(var(--spacing-unit) * 1.5);
  }
  
  button {
    background: var(--primary);
    padding: var(--button-padding);
    padding: var(--button-padding, 10px); // Fallback
  }
</style>
*/

// DYNAMIC THEMING
/*
<style>
  :root {
    --bg: white;
    --text: black;
  }
  
  :root.dark-theme {
    --bg: #1a1a1a;
    --text: white;
  }
  
  body {
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
  }
</style>

<script>
  document.documentElement.classList.toggle('dark-theme');
  // Or using CSS Media Query:
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #1a1a1a;
      --text: white;
    }
  }
</script>
*/

// COMPONENT-SCOPED VARIABLES
/*
<style>
  .card {
    --card-bg: white;
    --card-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    background: var(--card-bg);
    box-shadow: var(--card-shadow);
  }
  
  .card.elevated {
    --card-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Variable declaration and scope
✓ Fallback values
✓ Dynamic theme switching
✓ Media queries with variables
✓ Component-level variables
✓ calc() with variables
✓ JavaScript variable manipulation
*/


// ============================================
// QUESTION 14: Masking and Clipping
// ============================================
/*
QUESTION:
Use CSS clip-path and mask properties for creative shapes.
*/

// CLIP-PATH - Cuts off content
/*
<style>
  .circle {
    clip-path: circle(50%);
    // Circular clip
  }
  
  .polygon {
    clip-path: polygon(
      0% 0%,
      100% 0%,
      85% 100%,
      0% 100%
    );
    // Custom polygon shape
  }
  
  .inset {
    clip-path: inset(10px 20px 30px 40px);
    // Remove edges - top right bottom left
  }
  
  .heart {
    clip-path: path('M0,50 Q0,0 50,0 T100,50 Q100,100 50,100 T0,50');
    // SVG path clip
  }
</style>
*/

// MASK - Uses image/gradient as mask
/*
<style>
  .gradient-mask {
    mask-image: linear-gradient(to right, black, transparent);
    // Fade out to right
  }
  
  .image-mask {
    mask-image: url(#mask-svg);
    // SVG mask
  }
  
  .radial-mask {
    mask-image: radial-gradient(circle, black 50%, transparent 100%);
    // Circular fade
  }
</style>
*/

// PRACTICAL: Image masks
/*
<style>
  .image-with-fade {
    position: relative;
  }
  
  .image-with-fade::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, black);
    pointer-events: none;
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ clip-path basic shapes
✓ polygon() for custom shapes
✓ inset() for rectangular clips
✓ Mask vs clip-path differences
✓ SVG masks and paths
✓ Gradient masks
✓ Performance considerations
*/


// ============================================
// QUESTION 15: Overflow and Scrolling
// ============================================
/*
QUESTION:
Advanced overflow handling, custom scrollbars, and scroll-behavior.
*/

// OVERFLOW PROPERTIES
/*
<style>
  .auto-scroll {
    overflow: auto;
    // Show scrollbar only if needed
    max-height: 300px;
  }
  
  .hidden-overflow {
    overflow: hidden;
  }
  
  .scrollable-x {
    overflow-x: auto;
    overflow-y: hidden;
    // Horizontal scroll only
  }
  
  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
*/

// CUSTOM SCROLLBAR
/*
<style>
  .custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
  
  // WebKit browsers (Chrome, Safari)
  .custom-scroll::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
*/

// SMOOTH SCROLL & SCROLL SNAP
/*
<style>
  html {
    scroll-behavior: smooth;
    // Smooth scrolling for anchor links
  }
  
  .scroll-snap {
    scroll-snap-type: x mandatory;
    // Snap to items
    overflow-x: auto;
  }
  
  .scroll-snap-item {
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }
</style>

<script>
  // Smooth scroll in JS
  element.scrollIntoView({ behavior: 'smooth' });
</script>
*/

/*
EVALUATION CRITERIA:
✓ overflow vs overflow-x/y
✓ Custom scrollbar styling
✓ Scroll snap behavior
✓ smooth scroll behavior
✓ Preventing scroll with hidden
✓ Multiple overflow directions
*/


// ============================================
// QUESTION 16: Box Model Deep Dive
// ============================================
/*
QUESTION:
Master box model edge cases and margin collapsing.
*/

// MARGIN COLLAPSING
/*
<style>
  /* Vertical margins collapse: */
  .item1 {
    margin-bottom: 20px;
  }
  
  .item2 {
    margin-top: 30px;
  }
  /* Between item1 and item2: 30px (not 50px) */
  
  /* Collapsing prevented by: */
  .prevent1 {
    overflow: hidden;
    // Creates BFC
  }
  
  .prevent2 {
    display: flex;
    // Flex container, no collapsing
  }
  
  .prevent3 {
    padding-top: 1px;
    // Padding prevents collapse
  }
</style>
*/

// BOX-SIZING
/*
<style>
  .content-box {
    box-sizing: content-box;
    // Default: width = content only
    width: 200px;
    padding: 20px;
    // Total = 200 + 40 = 240px
  }
  
  .border-box {
    box-sizing: border-box;
    // width includes padding and border
    width: 200px;
    padding: 20px;
    // Total = 200px (includes padding)
  }
  
  /* Best practice: */
  * {
    box-sizing: border-box;
  }
</style>
*/

// NEGATIVE MARGINS
/*
<style>
  .overlap {
    margin-left: -50px;
    // Overlaps previous element
  }
  
  .pull-out {
    margin-top: -20px;
    // Pulls element up
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Margin collapsing rules
✓ When collapsing occurs/doesn't occur
✓ box-sizing differences
✓ Negative margins use cases
✓ BFC creation to prevent collapsing
*/


// ============================================
// QUESTION 17: Backdrop Filters and Effects
// ============================================
/*
QUESTION:
Use backdrop-filter for glassmorphism and special effects.
*/

// BACKDROP FILTER
/*
<style>
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    // Blur background behind element
  }
  
  .glass-advanced {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px) brightness(1.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
  }
</style>

BROWSER SUPPORT: Safari, Chrome 76+
*/

// FALLBACK FOR OLDER BROWSERS
/*
Use JS for positioning until backdrop filtering is widely supported
or use position: absolute with JavaScript positioning
*/

/*
EVALUATION CRITERIA:
✓ backdrop-filter syntax
✓ Multiple filters
✓ Browser support awareness
✓ Performance considerations
✓ Practical glass morphism designs
*/


// ============================================
// QUESTION 18: Mix-Blend-Mode
// ============================================
/*
QUESTION:
Use mix-blend-mode for creative layer blending.
*/

// BLEND MODES
/*
<style>
  .screen {
    mix-blend-mode: screen;
    // Lightens
  }
  
  .multiply {
    mix-blend-mode: multiply;
    // Darkens
  }
  
  .overlay {
    mix-blend-mode: overlay;
    // Combines multiply and screen
  }
  
  .darken {
    mix-blend-mode: darken;
    // Takes darkest color
  }
  
  .lighten {
    mix-blend-mode: lighten;
    // Takes lightest color
  }
  
  .color-dodge {
    mix-blend-mode: color-dodge;
    // Bright effect
  }
</style>
*/

// PRACTICAL EXAMPLE
/*
<style>
  .image-overlay {
    position: relative;
    background: url(image.jpg);
  }
  
  .image-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, red, blue);
    mix-blend-mode: color;
    pointer-events: none;
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Different blend modes
✓ Blend mode behavior
✓ Visual effects with blend modes
✓ Performance considerations
✓ Creative layering with blend modes
*/


// ============================================
// QUESTION 19: Aspect Ratio and Intrinsic Size
// ============================================
/*
QUESTION:
Use aspect-ratio and intrinsic sizing for responsive layouts.
*/

// ASPECT RATIO
/*
<style>
  .video {
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
    // Maintains 16:9 ratio
  }
  
  .square {
    aspect-ratio: 1;
  }
  
  .portrait {
    aspect-ratio: 3 / 4;
  }
</style>
*/

// INTRINSIC SIZING
/*
<style>
  img {
    max-width: 100%;
    height: auto;
    // Prevents layout shift
  }
  
  .container {
    width: min(100%, 900px);
    // Responsive clamping
  }
  
  .sidebar {
    flex: 0 0 minmax(250px, 1fr);
    // Flexible sidebar
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ aspect-ratio browser support
✓ Using aspect-ratio with image
✓ Video embed sizing
✓ CLS prevention
✓ Auto sizing calculations
*/


// ============================================
// QUESTION 20: CSS Subgrid
// ============================================
/*
QUESTION:
Use CSS subgrid for complex nested grid layouts.
*/

// SUBGRID
/*
<style>
  .parent {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 20px;
  }
  
  .child {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    // Child inherits parent's column lines
  }
  
  .nested-item {
    grid-column: 2;
    // Spans parent's 2nd column exactly
  }
</style>
*/

// MULTI-LEVEL SUBGRID
/*
<style>
  .level1 {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
  
  .level2 {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / 7;
    gap: subgrid; // Inherit gap too
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Subgrid concept
✓ Column inheritance
✓ Row inheritance
✓ Gap inheritance
✓ Nested grid complexity
✓ Browser support (modern browsers)
*/


// ============================================
// QUESTION 21: CSS Containment
// ============================================
/*
QUESTION:
Use CSS containment to isolate styles and improve performance.
*/

// CONTAINMENT
/*
<style>
  .isolated-widget {
    contain: layout style paint;
    // Browser can optimize this subtree
  }
  
  .layout-only {
    contain: layout;
    // Only layout is contained
  }
  
  .strict-contain {
    contain: strict;
    // Layout, style, paint, and size
  }
</style>
*/

// PRACTICAL EXAMPLE
/*
<style>
  /* List items don't affect each other's layout */
  .list-item {
    contain: layout style paint;
  }
  
  /* Ads in a sidebar */
  .ad-widget {
    contain: layout;
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Containment values
✓ Performance benefits
✓ What gets contained
✓ Layout containment
✓ Paint containment
✓ Style containment
*/


// ============================================
// QUESTION 22: CSS Anchor Positioning
// ============================================
/*
QUESTION:
Use CSS anchor positioning (new feature) for tooltip and popover positioning.
*/

// ANCHOR POSITIONING (Emerging standard)
/*
<style>
  .button {
    anchor-name: --my-button;
  }
  
  .tooltip {
    position: absolute;
    top: anchor(--my-button bottom);
    left: anchor(--my-button center);
    // Positioned relative to anchored element
  }
</style>
*/

// FALLBACK FOR OLDER BROWSERS
/*
Use JS for positioning until anchor positioning is widely supported
or use position: absolute with JavaScript positioning
*/

/*
EVALUATION CRITERIA:
✓ Anchor positioning concept
✓ anchor-name property
✓ anchor() function
✓ Browser support awareness
✓ Popover positioning use case
*/


// ============================================
// QUESTION 23: CSS Grid Auto-placement
// ============================================
/*
QUESTION:
Master CSS Grid auto-placement algorithm.
Control row and column placement with named areas.
*/

// AUTO-PLACEMENT
/*
<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: row;
    // Items place row-by-row (default)
  }
  
  .grid-dense {
    grid-auto-flow: dense;
    // Fill holes in layout (items may reorder)
  }
</style>
*/

// NAMED GRID AREAS
/*
<style>
  .layout {
    display: grid;
    grid-template-areas:
      'header header header'
      'sidebar main main'
      'footer footer footer';
    grid-template-columns: 200px 1fr 1fr;
    gap: 20px;
  }
  
  .header { grid-area: header; }
  .sidebar { grid-area: sidebar; }
  .main { grid-area: main; }
  .footer { grid-area: footer; }
</style>
*/

/*
EVALUATION CRITERIA:
✓ Auto-flow direction
✓ dense placement
✓ Named grid areas
✓ Complex layouts with areas
✓ Responsive area changes
*/


// ============================================
// QUESTION 24: Print Styles and Page Layout
// ============================================
/*
QUESTION:
Create print-friendly stylesheets and page layouts.
*/

// PRINT MEDIA QUERY
/*
<style>
  @media print {
    /* Hide navigation, ads, etc */
    nav, .ad, .sidebar {
      display: none;
    }
    
    /* Full width for printing */
    body {
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    /* Page breaks */
    .page-break {
      page-break-after: always;
    }
    
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* Keep heading and content together */
    h2 {
      page-break-after: avoid;
    }
    
    /* Expand abbreviations */
    abbr[title]::after {
      content: ' (' attr(title) ')';
    }
  }
</style>
*/

// PRINT LAYOUT
/*
<style>
  @page {
    size: A4;
    margin: 1in;
  }
  
  @page :first {
    margin-top: 2in;
  }
</style>
*/

/*
EVALUATION CRITERIA:
✓ @media print
✓ page-break properties
✓ Widows and orphans control
✓ Hide non-essential elements
✓ Print optimization
✓ @page rule
*/


// ============================================
// QUESTION 25: CSS Advanced Performance
// ============================================
/*
QUESTION:
Optimize CSS for performance and rendering.
Minimize reflows, repaints, and compose layers.
*/

// WILL-CHANGE SPARINGLY
/*
<style>
  .will-change-soon {
    will-change: transform, opacity;
  }
  
  /* Don't overuse - creates performance overhead */
</style>
*/

// PERFORMANCE TIPS:
/*
1. Use transform and opacity for animations (GPU accelerated)
2. Avoid animating: width, height, position, left, top, right, bottom
3. Use contain: paint to isolate paint operations
4. Minimize font reflows with font-display: swap
5. Use CSS variables instead of SASS for dynamic updates
6. Batch DOM changes
7. Use CSS containment for widgets
8. Lazy load CSS with media queries
9. Critical CSS inlining for above-the-fold content
10. Tree-shaking unused CSS with Purgecss/JIT

DEVELOPER TOOLS:
- Chrome DevTools: Performance tab shows reflows/repaints
- Lighthouse for paint timing
- Rendering statistics in DevTools
*/

/*
EVALUATION CRITERIA:
✓ Knows expensive CSS operations
✓ GPU acceleration awareness
✓ will-change usage
✓ contain for performance
✓ Transform over position
✓ Font optimization
✓ Critical CSS understanding
✓ Practical performance improvement
*/
