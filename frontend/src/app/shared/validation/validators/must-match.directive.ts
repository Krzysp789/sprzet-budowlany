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
  selector: "[mustMatch]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MustMatchDirective,
      multi: true,
    },
  ],
})
export class MustMatchDirective implements Validator {
  @Input("mustMatch") MatchPassword: string[] = [];

  constructor(private readonly validator: ValidatorsService) {}

  validate(control: AbstractControl) {
    return this.validator.matchPassword(
      this.MatchPassword[0],
      this.MatchPassword[1]
    )(control);
  }
}
