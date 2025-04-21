bankName: ['', [Validators.required, Validators.pattern("^[A-Za-z\\s&.,'-]{2,50}$")]],
accountNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8,20}$")]], // Allows 8-20 digit numbers
abaRoutingNumber: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]], // Must be 9 digits
wireRoutingNumber: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]], // Same format
addressLine1: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9\\s#.,'-]{5,100}$")]],
addressLine2: ['', [Validators.pattern("^[A-Za-z0-9\\s#.,'-]{0,100}$")]], // Optional
city: ['', [Validators.required, Validators.pattern("^[A-Za-z\\s-]{2,50}$")]],
zipcode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(-[0-9]{4})?$")]] // 