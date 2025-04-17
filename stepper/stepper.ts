import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-user-stepper',
  templateUrl: './user-stepper.component.html',
  styleUrls: ['./user-stepper.component.css']
})
export class UserStepperComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  userType: 'Controller' | 'Guarantor' = 'Controller';
  disbursementForm!: FormGroup;
  autoDebitForm!: FormGroup;

  approvedAmount = 10000;
  initialDisbursementToggle = false;
  useBankAccount = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userType = data?.userType || 'Controller';
  }

  ngOnInit(): void {
    this.disbursementForm = this.fb.group({
      initialDisbursementToggle: [false],
      disbursementAmount: [null, Validators.min(1)],
    });

    this.autoDebitForm = this.fb.group({
      useBankAccount: [true],
      bankName: [''],
      accountNumber: [''],
      routingNumber: [''],
    });
  }

  submitController() {
    alert('Submitted Controller Flow');
    this.dialogRef.close();
  }

  submitGuarantor() {
    alert('Guarantor Accepted');
    this.dialogRef.close();
  }
}
