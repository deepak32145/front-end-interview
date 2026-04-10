import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-date',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label [for]="config.key" class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <input
        [id]="config.key"
        type="date"
        [formControl]="control"
        class="field-input"
        [class.has-error]="isInvalid"
        (change)="onChange()"
      />
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select a date.</span>
      </div>
    </div>
  `,
})
export class FormDateComponent implements OnInit {
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
