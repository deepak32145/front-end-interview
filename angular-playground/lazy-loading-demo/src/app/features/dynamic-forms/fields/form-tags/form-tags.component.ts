import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-tags',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <div class="tags-input-box" [class.has-error]="isInvalid" (click)="inputEl.focus()">
        <span class="tag" *ngFor="let tag of tags">
          {{ tag }}
          <button type="button" class="tag-remove" (click)="remove(tag)">✕</button>
        </span>
        <input
          #inputEl
          type="text"
          class="tags-input"
          placeholder="{{ tags.length === 0 ? (config.placeholder || 'Add tag and press Enter') : '' }}"
          [(ngModel)]="inputValue"
          (keydown.enter)="add($event)"
          (keydown.backspace)="onBackspace()"
        />
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please add at least one tag.</span>
      </div>
    </div>
  `,
})
export class FormTagsComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  inputValue = '';
  get tags(): string[] { return this.control.value || []; }
  get isInvalid() { return this.control.invalid && this.control.touched; }

  ngOnInit() {
    if (!this.control.value) this.control.setValue([]);
  }

  add(e: Event) {
    e.preventDefault();
    const val = this.inputValue.trim();
    if (val && !this.tags.includes(val)) {
      const next = [...this.tags, val];
      this.control.setValue(next);
      this.control.markAsTouched();
      this.fieldChange.emit({ key: this.config.key, value: next });
    }
    this.inputValue = '';
  }

  remove(tag: string) {
    const next = this.tags.filter(t => t !== tag);
    this.control.setValue(next);
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value: next });
  }

  onBackspace() {
    if (!this.inputValue && this.tags.length) {
      this.remove(this.tags[this.tags.length - 1]);
    }
  }
}
