import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[paymentExist][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExistPaymentDirective,
      multi: true,
    },
  ],
})
export class ExistPaymentDirective implements Validator {

  constructor(private validator: ValidatorsService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator.existPaymentValidator(control);
  }
}
