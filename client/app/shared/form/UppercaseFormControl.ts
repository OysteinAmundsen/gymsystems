import { FormControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';

export class UppercaseFormControl extends FormControl {
  constructor(
    formState?: any,
    validator?: ValidatorFn | ValidatorFn[] | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validator, asyncValidator);
    this.valueChanges.distinctUntilChanged().subscribe((t: string) => {
      this.setValue(t.toUpperCase(), {
        onlySelf: true,
        emitEvent: false,
        emitModelToViewChange: true,
        emitViewToModelChange: false
      });
    });
  }
}
