import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-range',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label [for]="config.key" class="field-label">
        {{ config.label }}
        <span class="range-value">{{ control.value }}</span>
      </label>
      <input
        [id]="config.key"
        type="range"
        [min]="config.min ?? 0"
        [max]="config.max ?? 100"
        [step]="config.step ?? 1"
        [formControl]="control"
        class="field-range"
        (input)="onChange()"
      />
      <div class="range-labels">
        <span>{{ config.min ?? 0 }}</span>
        <span>{{ config.max ?? 100 }}</span>
      </div>
      <p class="field-hint" *ngIf="config.hint">{{ config.hint }}</p>
    </div>
  `,
})
export class FormRangeComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  onChange() {
    this.fieldChange.emit({ key: this.config.key, value: this.control.value });
  }
}
