import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-toggle',
  standalone: false,
  template: `
    <div class="field-wrap field-wrap--inline">
      <label class="toggle-label">
        <span class="field-label">{{ config.label }}</span>
        <div class="toggle-track" [class.on]="control.value" (click)="toggle()">
          <div class="toggle-thumb"></div>
        </div>
        <span class="toggle-state">{{ control.value ? 'Yes' : 'No' }}</span>
      </label>
      <p class="field-hint" *ngIf="config.hint">{{ config.hint }}</p>
    </div>
  `,
})
export class FormToggleComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  toggle() {
    this.control.setValue(!this.control.value);
    this.fieldChange.emit({ key: this.config.key, value: this.control.value });
  }
}
