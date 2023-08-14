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
  selector: '[uniqueEquipment][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueEquipmentDirective,
    multi: true,
  }],
})
export class UniqueEquipmentDirective implements AsyncValidator {
  @Input('uniqueEquipment') equipmentName: string;

  constructor(private validator: AsyncValidatorsService) { }

  validate(control: AbstractControl) {
    return this.validator.uniqueEquipment(this.equipmentName)(control);
  }
}
