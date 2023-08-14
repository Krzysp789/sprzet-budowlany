import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[rentStatusExist][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExistRentStatusDirective,
      multi: true,
    },
  ],
})
export class ExistRentStatusDirective implements Validator {

  constructor(private validator: ValidatorsService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator.existRentStatusValidator(control);
  }
}
