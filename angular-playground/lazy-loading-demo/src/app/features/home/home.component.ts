import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <section class="hero">
      <h1>Welcome to Lazy Loading Demo</h1>
      <p>
        This Angular app demonstrates <strong>lazy loading</strong> — each feature
        module (About, Contact, Careers) is bundled into a separate chunk and only
        downloaded when the user navigates to that route.
      </p>
      <ul class="how-it-works">
        <li>Open the browser <strong>Network</strong> tab</li>
        <li>Click <strong>About</strong>, <strong>Contact</strong>, or <strong>Careers</strong> in the nav</li>
        <li>Watch a new <code>.js</code> chunk load on demand</li>
      </ul>
    </section>
  `,
  styles: [`
    .hero { max-width: 640px; margin: 60px auto; text-align: center; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #3f51b5; }
    p { font-size: 1.1rem; line-height: 1.6; color: #444; }
    .how-it-works { list-style: none; padding: 0; margin-top: 1.5rem; }
    .how-it-works li { padding: 0.4rem 0; font-size: 1rem; color: #555; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  `]
})
export class HomeComponent {}
