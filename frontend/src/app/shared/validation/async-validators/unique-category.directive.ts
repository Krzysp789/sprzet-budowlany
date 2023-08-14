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
  selector: '[uniqueCategory][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueCategoryDirective,
    multi: true,
  }],
})
export class UniqueCategoryDirective implements AsyncValidator {
  @Input('uniqueCategory') categoryName: string;

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.uniqueCategory(this.categoryName)(control);
  }
}
