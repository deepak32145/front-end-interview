import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.css"],
})
export class DynamicFormComponent implements OnInit {
  userForm: FormGroup;
  users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    { id: 5, name: "User 5" },
  ];
  ethnicOptions = ["Cuban", "Mexican", "Puerto Rican"];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      users: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.initUserForms();
  }

  get usersArray(): FormArray {
    return this.userForm.get("users") as FormArray;
  }

  initUserForms() {
    this.users.forEach(() => {
      this.usersArray.push(
        this.fb.group({
          ethnicity: [""], // Main question radio button
          ethnicDetails: this.fb.group({
            selectedOptions: [[]], // Array to store selected options
            other: [""], // Textbox for 'Other'
          }),
        })
      );
    });
  }

  toggleEthnicOptions(index: number) {
    const userControl = this.usersArray.at(index);
    const ethnicity = userControl.get("ethnicity")?.value;

    if (ethnicity !== "Hispanic or Latino") {
      // Clear ethnicDetails if not 'Hispanic or Latino'
      const ethnicDetails = userControl.get("ethnicDetails") as FormGroup;
      ethnicDetails.get("selectedOptions")?.setValue([]);
      ethnicDetails.get("other")?.setValue("");
    }
  }

  updateSelectedOptions(index: number, option: string, isChecked: boolean) {
    const selectedOptions = this.usersArray
      .at(index)
      .get("ethnicDetails.selectedOptions") as any;

    if (isChecked) {
      selectedOptions.setValue([...selectedOptions.value, option]);
    } else {
      selectedOptions.setValue(
        selectedOptions.value.filter((o: string) => o !== option)
      );
    }
  }

  submitForm() {
    console.log(this.userForm.value);
  }
}
