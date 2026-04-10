import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldChangeEvent, FormFieldConfig } from '../form-field.model';

@Component({
  selector: 'app-form-page',
  standalone: false,
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent {
  submitState: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  savedFilename = '';
  lastChange: FieldChangeEvent | null = null;

  constructor(private http: HttpClient) {}

  // ── JSON config that drives the entire form ───────────────────────────────
  fields: FormFieldConfig[] = [
    // ── Personal Info ────────────────────────────────────────────────────────
    {
      key: 'firstName', type: 'input', label: 'First Name', placeholder: 'John',
      width: 'half', inputType: 'text',
      validations: { required: true, minLength: 2, maxLength: 50 },
    },
    {
      key: 'lastName', type: 'input', label: 'Last Name', placeholder: 'Doe',
      width: 'half', inputType: 'text',
      validations: { required: true, minLength: 2, maxLength: 50 },
    },
    {
      key: 'email', type: 'input', label: 'Email Address', placeholder: 'john@example.com',
      width: 'half', inputType: 'email',
      validations: { required: true, email: true },
    },
    {
      key: 'phone', type: 'input', label: 'Phone Number', placeholder: '+91 98765 43210',
      width: 'half', inputType: 'tel',
      validations: { required: true, pattern: '^[+]?[0-9 \\-]{7,15}$', patternMessage: 'Enter a valid phone number.' },
    },
    {
      key: 'dob', type: 'date', label: 'Date of Birth',
      width: 'half',
      validations: { required: true },
      hint: 'Must be 18 or older',
    },
    {
      key: 'website', type: 'input', label: 'Personal Website', placeholder: 'https://yoursite.com',
      width: 'half', inputType: 'url',
      validations: { pattern: '^https?://.+', patternMessage: 'URL must start with http:// or https://' },
    },

    // ── Professional ─────────────────────────────────────────────────────────
    {
      key: 'jobTitle', type: 'input', label: 'Current Job Title', placeholder: 'Senior Frontend Engineer',
      width: 'half', inputType: 'text',
      validations: { required: true },
    },
    {
      key: 'experience', type: 'select', label: 'Years of Experience',
      width: 'half',
      options: [
        { label: '0 – 1 year',  value: '0-1' },
        { label: '1 – 3 years', value: '1-3' },
        { label: '3 – 5 years', value: '3-5' },
        { label: '5 – 8 years', value: '5-8' },
        { label: '8+ years',    value: '8+' },
      ],
      validations: { required: true },
    },
    {
      key: 'department', type: 'search-select', label: 'Department',
      width: 'half',
      placeholder: '— Search department —',
      options: [
        { label: 'Engineering',        value: 'engineering' },
        { label: 'Product',            value: 'product' },
        { label: 'Design',             value: 'design' },
        { label: 'Marketing',          value: 'marketing' },
        { label: 'Sales',              value: 'sales' },
        { label: 'Human Resources',    value: 'hr' },
        { label: 'Finance',            value: 'finance' },
        { label: 'Operations',         value: 'operations' },
        { label: 'Legal',              value: 'legal' },
        { label: 'Customer Success',   value: 'customer-success' },
      ],
      validations: { required: true },
    },
    {
      key: 'country', type: 'search-select', label: 'Country',
      width: 'half',
      placeholder: '— Search country —',
      options: [
        { label: 'India',          value: 'IN' },
        { label: 'United States',  value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Germany',        value: 'DE' },
        { label: 'Canada',         value: 'CA' },
        { label: 'Australia',      value: 'AU' },
        { label: 'Singapore',      value: 'SG' },
        { label: 'Japan',          value: 'JP' },
      ],
      validations: { required: true },
    },
    {
      key: 'salary', type: 'input', label: 'Expected Salary (INR / year)', placeholder: '1800000',
      width: 'half', inputType: 'number',
      validations: { required: true, min: 100000, max: 50000000 },
      hint: 'Annual CTC in Indian Rupees',
    },
    {
      key: 'noticePeriod', type: 'range', label: 'Notice Period (days)',
      width: 'full', min: 0, max: 90, step: 15,
      defaultValue: 30,
      hint: '0 = immediate joiner',
    },

    // ── Skills & Preferences ─────────────────────────────────────────────────
    {
      key: 'skills', type: 'tags', label: 'Skills', placeholder: 'Type skill and press Enter',
      width: 'full',
      validations: { required: true },
      hint: 'e.g. Angular, TypeScript, Node.js',
    },
    {
      key: 'workMode', type: 'radio', label: 'Preferred Work Mode',
      width: 'half',
      options: [
        { label: 'Remote',        value: 'remote' },
        { label: 'Hybrid',        value: 'hybrid' },
        { label: 'On-site',       value: 'onsite' },
      ],
      validations: { required: true },
    },
    {
      key: 'employmentType', type: 'checkbox-group', label: 'Open to Employment Types',
      width: 'half',
      options: [
        { label: 'Full-time',  value: 'fulltime' },
        { label: 'Part-time',  value: 'parttime' },
        { label: 'Contract',   value: 'contract' },
        { label: 'Freelance',  value: 'freelance' },
      ],
      validations: { required: true },
    },
    {
      key: 'relocate', type: 'toggle', label: 'Willing to Relocate',
      width: 'half', defaultValue: false,
    },
    {
      key: 'clearanceLevel', type: 'select', label: 'Security Clearance',
      width: 'half',
      options: [
        { label: 'None',        value: 'none' },
        { label: 'Basic',       value: 'basic' },
        { label: 'Confidential', value: 'confidential' },
        { label: 'Secret',      value: 'secret' },
      ],
      validations: { required: true },
    },

    // ── Bio & Files ──────────────────────────────────────────────────────────
    {
      key: 'bio', type: 'textarea', label: 'Professional Summary', rows: 5,
      width: 'full', placeholder: 'Brief description of your experience and goals...',
      validations: { required: true, minLength: 50, maxLength: 1000 },
      hint: 'Minimum 50 characters',
    },
    {
      key: 'resume', type: 'file', label: 'Upload Resume',
      width: 'half', accept: '.pdf,.doc,.docx',
      validations: { required: true },
      hint: 'PDF or Word document',
    },
    {
      key: 'portfolio', type: 'file', label: 'Upload Portfolio (optional)',
      width: 'half', accept: '.pdf,.zip,.png,.jpg',
      multiple: true,
      hint: 'Multiple files allowed',
    },

    // ── Consent ───────────────────────────────────────────────────────────────
    {
      key: 'newsletter', type: 'toggle', label: 'Subscribe to job alerts',
      width: 'half', defaultValue: true,
    },
    {
      key: 'agreeTerms', type: 'checkbox', label: 'I agree to the Terms & Conditions and Privacy Policy',
      width: 'full',
      validations: { required: true },
    },
  ];

  // ── Event handlers ────────────────────────────────────────────────────────
  onFieldChange(event: FieldChangeEvent) {
    this.lastChange = event;
  }

  onFormSubmit(payload: Record<string, any>) {
    this.submitState = 'loading';
    console.log('payload' , payload);
    this.http.post<any>('http://localhost:3000/api/form/submit', payload).subscribe({
      next: (res) => {
        this.submitState  = 'success';
        this.savedFilename = res.filename;
      },
      error: () => {
        this.submitState = 'error';
      },
    });
  }
}
