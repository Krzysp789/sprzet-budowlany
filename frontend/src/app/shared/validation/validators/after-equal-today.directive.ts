import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[afterEqualToday][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AfterEqualTodayDirective,
      multi: true,
    },
  ],
})
export class AfterEqualTodayDirective implements Validator {

  constructor(private validator: ValidatorsService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator.afterEqualToday(control);
  }

}
