import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-input',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label [for]="config.key" class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <input
        [id]="config.key"
        [type]="config.inputType || 'text'"
        [placeholder]="config.placeholder || ''"
        [formControl]="control"
        class="field-input"
        [class.has-error]="isInvalid"
        (change)="onChange()"
      />
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">This field is required.</span>
        <span *ngIf="control.errors?.['minlength']">Minimum {{ config.validations?.minLength }} characters.</span>
        <span *ngIf="control.errors?.['maxlength']">Maximum {{ config.validations?.maxLength }} characters.</span>
        <span *ngIf="control.errors?.['email']">Enter a valid email address.</span>
        <span *ngIf="control.errors?.['pattern']">{{ config.validations?.patternMessage || 'Invalid format.' }}</span>
        <span *ngIf="control.errors?.['min']">Minimum value is {{ config.validations?.min }}.</span>
        <span *ngIf="control.errors?.['max']">Maximum value is {{ config.validations?.max }}.</span>
      </div>
    </div>
  `,
})
export class FormInputComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  onChange() { this.control.markAsTouched(); }
}
