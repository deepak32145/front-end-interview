export type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'search-select'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'date'
  | 'toggle'
  | 'range'
  | 'tags'
  | 'file';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormFieldConfig {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  hint?: string;
  defaultValue?: any;
  options?: FieldOption[];       // select / radio / checkbox-group / search-select
  min?: number;
  max?: number;
  step?: number;
  accept?: string;               // file input
  multiple?: boolean;
  rows?: number;                 // textarea
  inputType?: string;            // input sub-type: text | email | password | number | tel | url
  validations?: FieldValidation;
  width?: 'full' | 'half';
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
  email?: boolean;
  url?: boolean;
}

export interface FieldChangeEvent {
  key: string;
  value: any;
}
