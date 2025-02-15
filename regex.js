
onMobileNumberInput(index: number) {
    const control = this.users.at(index).get('mobileNumber');
    if (control) {
      control.setValue(this.formatPhoneNumber(control.value), { emitEvent: false });
    }
  }

    // Function to format a phone number
    formatPhoneNumber(value: string): string {
        const cleaned = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length === 10) {
          return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
        }
        return value; // Return original value if it's not a valid 10-digit number
      }
    