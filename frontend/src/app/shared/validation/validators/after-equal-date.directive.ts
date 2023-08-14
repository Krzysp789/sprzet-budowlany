import {
  Directive,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
} from '@angular/forms';

import { ValidatorsService } from './validators.service';

@Directive({
  selector: '[afterEqualDate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AfterEqualDateDirective,
      multi: true,
    },
  ],
})
export class AfterEqualDateDirective implements Validator {

  @Input('afterEqualDate') date: [string, string | string[]] = ['', ''];

  constructor(private readonly validator: ValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.afterEqualDate(
      this.date[0],
      this.date[1]
    )(control);
  }

}
