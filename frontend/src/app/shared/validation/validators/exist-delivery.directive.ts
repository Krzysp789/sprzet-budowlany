import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[existDelivery][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExistDeliveryDirective,
      multi: true,
    },
  ],
})
export class ExistDeliveryDirective implements Validator {

  constructor(private validator: ValidatorsService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator.existDeliveryValidator(control);
  }
}
