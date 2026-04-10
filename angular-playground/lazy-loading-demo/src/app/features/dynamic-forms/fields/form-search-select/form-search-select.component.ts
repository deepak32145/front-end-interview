import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FieldOption, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-search-select',
  standalone: false,
  template: `
    <div class="field-wrap" (clickOutside)="close()">
      <label class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>

      <div class="ss-container" [class.has-error]="isInvalid">
        <div class="ss-input-row" (click)="toggle()">
          <span class="ss-value" *ngIf="selectedLabel">{{ selectedLabel }}</span>
          <span class="ss-placeholder" *ngIf="!selectedLabel">{{ config.placeholder || '— Search & Select —' }}</span>
          <span class="ss-clear" *ngIf="control.value" (click)="clear($event)">✕</span>
          <span class="ss-arrow">▾</span>
        </div>

        <div class="ss-dropdown" *ngIf="open">
          <input
            #searchInput
            type="text"
            class="ss-search"
            placeholder="Type to search..."
            [(ngModel)]="searchTerm"
          />
          <div class="ss-options">
            <div
              *ngFor="let opt of filtered"
              class="ss-option"
              [class.selected]="opt.value === control.value"
              (click)="select(opt)"
            >
              {{ opt.label }}
            </div>
            <div class="ss-empty" *ngIf="filtered.length === 0">No results found</div>
          </div>
        </div>
      </div>

      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select an option.</span>
      </div>
    </div>
  `,
})
export class FormSearchSelectComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  open = false;
  searchTerm = '';

  get isInvalid() { return this.control.invalid && this.control.touched; }

  get filtered(): FieldOption[] {
    const term = this.searchTerm.toLowerCase();
    return (this.config.options || []).filter(o =>
      o.label.toLowerCase().includes(term)
    );
  }

  get selectedLabel(): string {
    const opt = (this.config.options || []).find(o => o.value === this.control.value);
    return opt ? opt.label : '';
  }

  ngOnInit() {
    this.control.valueChanges.subscribe(v =>
      this.fieldChange.emit({ key: this.config.key, value: v })
    );
  }

  toggle() { this.open = !this.open; this.searchTerm = ''; }
  close()  { this.open = false; }

  select(opt: FieldOption) {
    this.control.setValue(opt.value);
    this.control.markAsTouched();
    this.open = false;
    this.searchTerm = '';
    this.fieldChange.emit({ key: this.config.key, value: opt.value });
  }

  clear(e: Event) {
    e.stopPropagation();
    this.control.setValue('');
    this.control.markAsTouched();
  }
}
