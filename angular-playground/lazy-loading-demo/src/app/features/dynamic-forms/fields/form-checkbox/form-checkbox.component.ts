import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-checkbox',
  standalone: false,
  template: `
    <div class="field-wrap field-wrap--inline">
      <label class="checkbox-option">
        <input
          type="checkbox"
          [formControl]="control"
          (change)="onChange()"
        />
        <span class="checkbox-mark"></span>
        <span class="checkbox-label">
          {{ config.label }}
          <span class="required-star" *ngIf="config.validations?.required">*</span>
        </span>
      </label>
      <p class="field-hint" *ngIf="config.hint">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">This field is required.</span>
      </div>
    </div>
  `,
})
export class FormCheckboxComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  onChange() {
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value: this.control.value });
  }
}
