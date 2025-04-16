import { Component, OnInit, Inject , AfterViewInit , ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-lines-loans-dialog',
  templateUrl: './lines-loans-dialog.component.html',
  styleUrl: './lines-loans-dialog.component.css'
})
export class LinesLoansDialogComponent implements OnInit , AfterViewInit {
 @ViewChild('stepper') stepper!: MatStepper;
  firstFormGroup!: FormGroup;
  apiResponse: any;
  skipFirstStep = false;


  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<LinesLoansDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      age : ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.data?.skipFirstStep) {
      this.skipFirstStep = true;
    }
  }
  ngAfterViewInit() {
    console.log('stepper', this.stepper);
    if (this.skipFirstStep) {
      //setTimeout(() => this.stepperRef.selectedIndex = 1, 0);
    }
  }

  goToSecondStep() {
    console.log('stepper', this.stepper);
    this.stepper.next();
  }

  submit() {
    alert('Form submitted!');
    this.dialogRef.close({ status: 'submitted', formData: this.firstFormGroup.value });
  }

  close() {
    this.dialogRef.close();
  }

}
