import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicFormsRoutingModule } from './dynamic-forms-routing-module';

import { FormPageComponent }          from './form-page/form-page.component';
import { DynamicFormComponent }       from './dynamic-form/dynamic-form.component';
import { FormInputComponent }         from './fields/form-input/form-input.component';
import { FormTextareaComponent }      from './fields/form-textarea/form-textarea.component';
import { FormSelectComponent }        from './fields/form-select/form-select.component';
import { FormSearchSelectComponent }  from './fields/form-search-select/form-search-select.component';
import { FormRadioComponent }         from './fields/form-radio/form-radio.component';
import { FormCheckboxComponent }      from './fields/form-checkbox/form-checkbox.component';
import { FormCheckboxGroupComponent } from './fields/form-checkbox-group/form-checkbox-group.component';
import { FormDateComponent }          from './fields/form-date/form-date.component';
import { FormToggleComponent }        from './fields/form-toggle/form-toggle.component';
import { FormRangeComponent }         from './fields/form-range/form-range.component';
import { FormTagsComponent }          from './fields/form-tags/form-tags.component';
import { FormFileComponent }          from './fields/form-file/form-file.component';

@NgModule({
  declarations: [
    FormPageComponent,
    DynamicFormComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    FormSearchSelectComponent,
    FormRadioComponent,
    FormCheckboxComponent,
    FormCheckboxGroupComponent,
    FormDateComponent,
    FormToggleComponent,
    FormRangeComponent,
    FormTagsComponent,
    FormFileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsRoutingModule,
  ],
})
export class DynamicFormsModule {}
