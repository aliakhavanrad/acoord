// Custom validator to check that two fields match
export function mustMatch(value: string, confirmValue: string): boolean {
  return value === confirmValue;
}

// Validator for phone number (digits only)
export function isValidPhoneNumber(phoneNumber: string): boolean {
  return /^[0-9]*$/.test(phoneNumber);
}

// Validator for password length
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
