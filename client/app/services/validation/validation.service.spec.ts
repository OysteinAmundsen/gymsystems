import { TestBed, inject } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { FormBuilder, FormControl } from '@angular/forms';

describe('services.validation:ValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ });
  });

  const ERR_RESPONSE = JSON.stringify({ validateEmail: { valid: false }});
  const testEmail = (ctrl: FormControl) => {
    const res = ValidationService.emailValidator(ctrl);
    return res ? JSON.stringify(res) : null;
  }

  it('should return error object on invalid email patterns', inject([], () => {
    expect(testEmail(new FormControl('error'))).toBe(ERR_RESPONSE);
    expect(testEmail(new FormControl('error@'))).toBe(ERR_RESPONSE);
    // expect(testEmail(new FormControl('error@err'))).toBe(ERR_RESPONSE);
    expect(testEmail(new FormControl('error@err.no'))).toBeNull();
  }));
});
