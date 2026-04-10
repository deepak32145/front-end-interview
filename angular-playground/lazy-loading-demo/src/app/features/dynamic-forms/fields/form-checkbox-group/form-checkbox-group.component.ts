import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-checkbox-group',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <div class="checkbox-group">
        <label *ngFor="let opt of config.options" class="checkbox-option">
          <input
            type="checkbox"
            [value]="opt.value"
            [checked]="isChecked(opt.value)"
            (change)="toggle(opt.value)"
          />
          <span class="checkbox-mark"></span>
          <span class="checkbox-label">{{ opt.label }}</span>
        </label>
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select at least one option.</span>
      </div>
    </div>
  `,
})
export class FormCheckboxGroupComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  get isInvalid() { return this.control.invalid && this.control.touched; }
  get selected(): any[] { return this.control.value || []; }

  ngOnInit() {
    if (!this.control.value) this.control.setValue([]);
  }

  isChecked(val: any) { return this.selected.includes(val); }

  toggle(val: any) {
    const current: any[] = [...this.selected];
    const idx = current.indexOf(val);
    idx === -1 ? current.push(val) : current.splice(idx, 1);
    this.control.setValue(current);
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value: current });
  }
}
