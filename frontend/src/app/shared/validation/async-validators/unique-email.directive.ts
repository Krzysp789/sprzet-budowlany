import {
  Directive,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';

import { AsyncValidatorsService } from './async-validators.service';

@Directive({
  selector: '[uniqueEmail][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UniqueEmailDirective),
    multi: true,
  }],
})
export class UniqueEmailDirective implements AsyncValidator {

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.uniqueEmail()(control);
  }

}
