import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {
  @Output() formSubmitted = new EventEmitter<any>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      users: this.fb.array([]) // Form Array for multiple users
    });
  }

  // Getter to access users form array
  get users() {
    return this.userForm.get('users') as FormArray;
  }

  // Function to add a new user row dynamically
  addUser() {
    const newUser = this.fb.group({
      enableToggle: [true], // Default "Yes"
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/), Validators.maxLength(25)]],
      age: ['', [Validators.required, Validators.min(1)]],
      SSN: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], // Only 4-digit numbers
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]], // USA format (123) 456-7890
      enableAccessCards: [false],
      fedexCards: [[]],
      isNew: [true] // Mark new users
    });

    this.users.push(newUser);
  }

  // Function to submit form
  submitForm() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      this.formSubmitted.emit(this.userForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}


<form [formGroup]="userForm" (ngSubmit)="submitForm()">
  <table>
    <thead>
      <tr>
        <th>Enable</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Age</th>
        <th>SSN</th>
        <th>Mobile Number</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let user of users.controls; let i = index" [formGroup]="user">
        <td><p-inputSwitch formControlName="enableToggle"></p-inputSwitch></td>
        
        <!-- First Name -->
        <td>
          <input matInput formControlName="firstName" [readonly]="!user.get('isNew')?.value" placeholder="Enter First Name">
          <span *ngIf="user.get('firstName')?.invalid && user.get('firstName')?.touched" class="error">
            First name should be alphabets only (Max 25 chars).
          </span>
        </td>

        <!-- Last Name -->
        <td>
          <input matInput formControlName="lastName" [readonly]="!user.get('isNew')?.value" placeholder="Enter Last Name">
          <span *ngIf="user.get('lastName')?.invalid && user.get('lastName')?.touched" class="error">
            Last name should be alphabets only (Max 25 chars).
          </span>
        </td>

        <!-- Age -->
        <td>
          <input matInput type="number" formControlName="age" [readonly]="!user.get('isNew')?.value" placeholder="Enter Age">
        </td>

        <!-- SSN -->
        <td>
          <input matInput formControlName="SSN" [readonly]="!user.get('isNew')?.value" placeholder="Enter 4-digit SSN">
          <span *ngIf="user.get('SSN')?.invalid && user.get('SSN')?.touched" class="error">
            SSN must be a 4-digit number.
          </span>
        </td>

        <!-- Mobile Number -->
        <td>
          <input matInput formControlName="mobileNumber" [readonly]="!user.get('isNew')?.value" placeholder="(123) 456-7890">
          <span *ngIf="user.get('mobileNumber')?.invalid && user.get('mobileNumber')?.touched" class="error">
            Enter a valid US phone number in (123) 456-7890 format.
          </span>
        </td>

        <td><button type="button" (click)="users.removeAt(i)">Remove</button></td>
      </tr>
    </tbody>
  </table>

  <button type="button" (click)="addUser()">Add New User</button>
  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>


.error {
    color: red;
    font-size: 12px;
    display: block;
    margin-top: 5px;
  }
  