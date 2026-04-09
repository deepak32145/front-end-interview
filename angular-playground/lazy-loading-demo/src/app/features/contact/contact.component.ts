import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,
  template: `
    <section class="page">
      <h2>Contact Us</h2>
      <p>Have a question or feedback? We'd love to hear from you.</p>
      <form class="contact-form" (ngSubmit)="submit()">
        <label>
          Name
          <input type="text" [(ngModel)]="name" name="name" placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea [(ngModel)]="message" name="message" rows="4" placeholder="Your message..."></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
      <p *ngIf="sent" class="confirmation">Thanks! We'll be in touch soon.</p>
      <div class="badge">Lazy chunk: <code>contact-module.js</code></div>
    </section>
  `,
  styles: [`
    .page { max-width: 600px; margin: 60px auto; }
    h2 { font-size: 1.8rem; color: #3f51b5; }
    p { line-height: 1.7; color: #444; }
    .contact-form { display: flex; flex-direction: column; gap: 12px; margin-top: 1.5rem; }
    label { display: flex; flex-direction: column; gap: 4px; font-weight: 500; color: #333; }
    input, textarea { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px;
                      font-size: 1rem; font-family: inherit; }
    button { align-self: flex-start; padding: 10px 20px; background: #3f51b5;
             color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    button:hover { background: #303f9f; }
    .confirmation { color: #2e7d32; font-weight: 500; margin-top: 1rem; }
    .badge { margin-top: 1.5rem; background: #e8eaf6; padding: 10px 16px;
             border-radius: 6px; font-size: 0.95rem; display: inline-block; }
    code { font-weight: bold; color: #3f51b5; }
  `]
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  sent = false;

  submit() {
    if (this.name && this.email && this.message) {
      this.sent = true;
      this.name = '';
      this.email = '';
      this.message = '';
    }
  }
}
