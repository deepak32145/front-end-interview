import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-textarea',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label [for]="config.key" class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <textarea
        [id]="config.key"
        [placeholder]="config.placeholder || ''"
        [formControl]="control"
        [rows]="config.rows || 4"
        class="field-input field-textarea"
        [class.has-error]="isInvalid"
        (blur)="control.markAsTouched()"
      ></textarea>
      <div class="char-count" *ngIf="config.validations?.maxLength">
        {{ control.value?.length || 0 }} / {{ config.validations?.maxLength }}
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">This field is required.</span>
        <span *ngIf="control.errors?.['minlength']">Minimum {{ config.validations?.minLength }} characters.</span>
        <span *ngIf="control.errors?.['maxlength']">Maximum {{ config.validations?.maxLength }} characters.</span>
      </div>
    </div>
  `,
})
export class FormTextareaComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }
}
