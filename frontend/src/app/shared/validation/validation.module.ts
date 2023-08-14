import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ExistAddressDirective,
} from './async-validators/exist-address.directive';
import {
  ExistCategoryDirective,
} from './async-validators/exist-category.directive';
import {
  ExistCustomerDirective,
} from './async-validators/exist-customer.directive';
import { ExistItemDirective } from './async-validators/exist-item.directive';
import {
  UniqueCategoryDirective,
} from './async-validators/unique-category.directive';
import {
  UniqueEquipmentDirective,
} from './async-validators/unique-equipment.directive';
import {
  UniqueItemInRentalDirective,
} from './async-validators/unique-item-in-rental.directive';
import { UniqueItemDirective } from './async-validators/unique-item.directive';
import { ControlErrorComponent } from './control-error.component';
import { ValidatePipe } from './validate.pipe';
import { ValidationMessagesModule } from './validation-messages.module';
import {
  AfterEqualDateDirective,
} from './validators/after-equal-date.directive';
import {
  AfterEqualTodayDirective,
} from './validators/after-equal-today.directive';
import { ExistDeliveryDirective } from './validators/exist-delivery.directive';
import {
  ExistItemStatusDirective,
} from './validators/exist-item-status.directive';
import { ExistPaymentDirective } from './validators/exist-payment.directive';
import {
  ExistRentStatusDirective,
} from './validators/exist-rent-status.directive';
import { MustMatchDirective } from './validators/must-match.directive';

@NgModule({
  declarations: [
    ValidatePipe,
    ControlErrorComponent,
    ExistAddressDirective,
    ExistRentStatusDirective,
    ExistDeliveryDirective,
    ExistPaymentDirective,
    UniqueEquipmentDirective,
    UniqueItemDirective,
    ExistItemStatusDirective,
    ExistItemDirective,
    UniqueItemInRentalDirective,
    UniqueCategoryDirective,
    ExistCategoryDirective,
    ExistCustomerDirective,
    AfterEqualTodayDirective,
    AfterEqualDateDirective,
    MustMatchDirective,
  ],
  imports: [
    CommonModule,
    ValidationMessagesModule
  ],
  exports: [
    ValidatePipe,
    ControlErrorComponent,
    ExistAddressDirective,
    ExistRentStatusDirective,
    ExistDeliveryDirective,
    ExistPaymentDirective,
    UniqueEquipmentDirective,
    UniqueItemDirective,
    ExistItemStatusDirective,
    ExistItemDirective,
    UniqueItemInRentalDirective,
    UniqueCategoryDirective,
    ExistCategoryDirective,
    ExistCustomerDirective,
    AfterEqualTodayDirective,
    AfterEqualDateDirective,
    MustMatchDirective,
  ]
})
export class ValidationModule { }
