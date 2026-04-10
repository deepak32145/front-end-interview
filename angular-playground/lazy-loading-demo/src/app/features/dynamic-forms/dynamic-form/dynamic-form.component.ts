import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../form-field.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: false,
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FormFieldConfig[] = [];
  @Input() submitLabel = 'Submit';
  @Output() formSubmit  = new EventEmitter<Record<string, any>>();
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  form!: FormGroup;
  submitAttempted = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const group: Record<string, FormControl> = {};
    this.fields.forEach(field => {
      group[field.key] = new FormControl(
        field.defaultValue ?? (field.type === 'checkbox' ? false : field.type === 'toggle' ? false : ''),
        this.buildValidators(field)
      );
    });
    this.form = this.fb.group(group);
  }

  getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  isFieldInvalid(key: string): boolean {
    const ctrl = this.getControl(key);
    return ctrl.invalid && (ctrl.touched || this.submitAttempted);
  }

  get invalidCount(): number {
    return this.fields.filter(f => this.getControl(f.key).invalid).length;
  }

  onFieldChange(event: FieldChangeEvent) {
    this.fieldChange.emit(event);
  }

  onSubmit() {
    this.submitAttempted = true;
    this.form.markAllAsTouched();
    this.cdr.markForCheck();

    if (this.form.invalid) {
      // Scroll to the first invalid field after the view has updated
      setTimeout(() => {
        const firstError = document.querySelector('.field-wrap .has-error, .field-wrap .ss-container.has-error, .tags-input-box.has-error, .file-drop-zone.has-error');
        if (firstError) {
          firstError.closest('.field-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    this.formSubmit.emit(this.form.value);
  }

  onReset() {
    this.submitAttempted = false;
    this.form.reset();
    this.fields.forEach(f => {
      if (f.type === 'checkbox' || f.type === 'toggle') this.getControl(f.key).setValue(false);
      if (f.type === 'checkbox-group' || f.type === 'tags') this.getControl(f.key).setValue([]);
    });
    this.cdr.markForCheck();
  }

  private buildValidators(field: FormFieldConfig) {
    const v = field.validations;
    if (!v) return [];
    const validators = [];
    if (v.required)    validators.push(Validators.required);
    if (v.minLength)   validators.push(Validators.minLength(v.minLength));
    if (v.maxLength)   validators.push(Validators.maxLength(v.maxLength));
    if (v.min != null) validators.push(Validators.min(v.min));
    if (v.max != null) validators.push(Validators.max(v.max));
    if (v.email)       validators.push(Validators.email);
    if (v.pattern)     validators.push(Validators.pattern(v.pattern));
    return validators;
  }
}
