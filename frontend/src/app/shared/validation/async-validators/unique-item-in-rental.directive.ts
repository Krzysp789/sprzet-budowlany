import {
  Directive,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';

import { AsyncValidatorsService } from './async-validators.service';

@Directive({
  selector: '[uniqueItemInRental][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueItemInRentalDirective,
    multi: true,
  }],
})
export class UniqueItemInRentalDirective implements AsyncValidator {
  @Input('uniqueItemInRental') data: [number, number];

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.uniqueItemInRental(this.data[0], this.data[1])(control);
  }
}
