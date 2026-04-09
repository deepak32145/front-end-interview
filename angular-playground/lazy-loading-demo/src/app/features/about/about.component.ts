import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  template: `
    <section class="page">
      <h2>About Us</h2>
      <p>
        We are a team of passionate engineers building tools that help developers
        learn modern Angular patterns — including lazy loading, signals, and
        standalone components.
      </p>
      <p>
        This module was loaded <strong>lazily</strong>. It was not part of the
        initial bundle — Angular only fetched it when you navigated here.
      </p>
      <div class="badge">Lazy chunk: <code>about-module.js</code></div>
    </section>
  `,
  styles: [`
    .page { max-width: 600px; margin: 60px auto; }
    h2 { font-size: 1.8rem; color: #3f51b5; }
    p { line-height: 1.7; color: #444; margin-bottom: 1rem; }
    .badge { margin-top: 1.5rem; background: #e8eaf6; padding: 10px 16px;
             border-radius: 6px; font-size: 0.95rem; display: inline-block; }
    code { font-weight: bold; color: #3f51b5; }
  `]
})
export class AboutComponent {}
