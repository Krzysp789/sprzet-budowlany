import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[existItemStatus][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExistItemStatusDirective,
      multi: true,
    },
  ],
})
export class ExistItemStatusDirective implements Validator {

  constructor(private validator: ValidatorsService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator.existItemStatusValidator(control);
  }
}
