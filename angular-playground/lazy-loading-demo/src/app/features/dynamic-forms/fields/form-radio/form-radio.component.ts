import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-radio',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <div class="radio-group">
        <label *ngFor="let opt of config.options" class="radio-option">
          <input
            type="radio"
            [name]="config.key"
            [value]="opt.value"
            [formControl]="control"
            (change)="onChange(opt.value)"
          />
          <span class="radio-mark"></span>
          <span class="radio-label">{{ opt.label }}</span>
        </label>
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select an option.</span>
      </div>
    </div>
  `,
})
export class FormRadioComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  onChange(value: any) {
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value });
  }
}
