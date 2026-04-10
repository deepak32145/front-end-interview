import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-select',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label [for]="config.key" class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <div class="select-wrapper">
        <select
          [id]="config.key"
          [formControl]="control"
          class="field-input field-select"
          [class.has-error]="isInvalid"
          (change)="onSelect($event)"
        >
          <option value="">{{ config.placeholder || '— Select —' }}</option>
          <option *ngFor="let opt of config.options" [value]="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <span class="select-arrow">▾</span>
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select an option.</span>
      </div>
    </div>
  `,
})
export class FormSelectComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  onSelect(e: Event) {
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value: (e.target as HTMLSelectElement).value });
  }
}
