import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-stepper-form',
  templateUrl: './stepper-form.component.html',
  styleUrls: ['./stepper-form.component.scss']
})
export class StepperFormComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup: FormGroup;
  apiResponse: any;
  skipFirstStep = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<StepperFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.skipFirstStep) {
      this.skipFirstStep = true;
    }
  }

  ngAfterViewInit() {
    if (this.skipFirstStep) {
      setTimeout(() => this.stepper.selectedIndex = 1, 0);
    }
  }

  goToSecondStep(stepper: MatStepper) {
    if (this.firstFormGroup.invalid) {
      this.firstFormGroup.markAllAsTouched();
      return;
    }

    const payload = this.firstFormGroup.value;

    this.http.post('https://jsonplaceholder.typicode.com/posts', payload).subscribe({
      next: (res) => {
        this.apiResponse = res;
        stepper.next();
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }

  submit() {
    console.log('Final Submit', this.apiResponse);
    this.dialogRef.close(this.apiResponse);
  }
}
