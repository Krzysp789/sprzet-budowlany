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
  selector: '[uniqueItem][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueItemDirective,
    multi: true,
  }],
})
export class UniqueItemDirective implements AsyncValidator {
  @Input() uniqueItem: [string, number];

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.uniqueItem(this.uniqueItem[0], this.uniqueItem[1])(control);
  }

}
