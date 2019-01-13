import { FormControl } from '@angular/forms';

export class ValidationService {

  static emailValidator(c: FormControl) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return EMAIL_REGEXP.test(c.value) ? null : { validateEmail: { valid: false }};
  }
}
