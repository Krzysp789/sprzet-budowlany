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
  selector: '[existAddress][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ExistAddressDirective,
    multi: true,
  }],
})
export class ExistAddressDirective implements AsyncValidator {
  @Input('existAddress') idCustomer: number;

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.existAddress(this.idCustomer)(control);
  }
}
