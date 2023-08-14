import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';

import { AsyncValidatorsService } from './async-validators.service';

@Directive({
  selector: '[existCustomer][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ExistCustomerDirective,
    multi: true,
  }],
})
export class ExistCustomerDirective implements AsyncValidator {

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.existCustomer()(control);
  }
}
