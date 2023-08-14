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
  selector: '[existItem][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ExistItemDirective,
    multi: true,
  }],
})
export class ExistItemDirective implements AsyncValidator {
  @Input('existItem') idEquipment: number;

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.existItem(this.idEquipment)(control);
  }
}
