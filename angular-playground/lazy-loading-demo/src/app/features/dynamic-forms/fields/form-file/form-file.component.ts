import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldChangeEvent, FormFieldConfig } from '../../form-field.model';

@Component({
  selector: 'app-form-file',
  standalone: false,
  template: `
    <div class="field-wrap">
      <label class="field-label">
        {{ config.label }}
        <span class="required-star" *ngIf="config.validations?.required">*</span>
      </label>
      <div class="file-drop-zone" [class.has-error]="isInvalid" (click)="fileInput.click()">
        <input
          #fileInput
          type="file"
          [accept]="config.accept || '*'"
          [multiple]="config.multiple || false"
          class="file-input-hidden"
          (change)="onFileChange($event)"
        />
        <div *ngIf="!fileNames.length" class="file-placeholder">
          <span class="file-icon">📂</span>
          <span>Click to browse or drag & drop</span>
          <small>{{ config.accept || 'All files' }}</small>
        </div>
        <div *ngIf="fileNames.length" class="file-selected">
          <span *ngFor="let name of fileNames" class="file-name">📄 {{ name }}</span>
        </div>
      </div>
      <p class="field-hint" *ngIf="config.hint && !isInvalid">{{ config.hint }}</p>
      <div class="field-errors" *ngIf="isInvalid">
        <span *ngIf="control.errors?.['required']">Please select a file.</span>
      </div>
    </div>
  `,
})
export class FormFileComponent {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();

  fileNames: string[] = [];
  get isInvalid() { return this.control.invalid && this.control.touched; }

  onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    this.fileNames = Array.from(files).map(f => f.name);
    this.control.setValue(this.fileNames.join(', '));
    this.control.markAsTouched();
    this.fieldChange.emit({ key: this.config.key, value: this.fileNames });
  }
}
