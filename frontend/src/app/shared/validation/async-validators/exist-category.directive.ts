import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';

import { AsyncValidatorsService } from './async-validators.service';

@Directive({
  selector: '[existCategory][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ExistCategoryDirective,
    multi: true,
  }],
})
export class ExistCategoryDirective implements AsyncValidator {

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.existCategory()(control);
  }
}
