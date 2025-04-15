import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stepper-form',
  templateUrl: './stepper-form.component.html',
  styleUrls: ['./stepper-form.component.scss']
})
export class StepperFormComponent implements OnInit {
  firstFormGroup!: FormGroup;
  apiResponse: any;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  goToSecondStep() {
    const payload = this.firstFormGroup.value;

    // Replace with your API endpoint
    this.http.post('https://jsonplaceholder.typicode.com/posts', payload).subscribe({
      next: (res) => {
        this.apiResponse = res;
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  submit() {
    alert('Form submitted!');
  }
}
