import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { ValidationModule } from 'src/app/shared/validation/validation.module';

import {
  AddressAddEditComponent,
} from './address-add-edit/address-add-edit.component';
import {
  AddressManageComponent,
} from './address-manage/address-manage.component';
import {
  DeliveryPaymentComponent,
} from './delivery-payment/delivery-payment.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  declarations: [
    OrderComponent,
    SummaryComponent,
    AddressManageComponent,
    AddressAddEditComponent,
    DeliveryPaymentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrderRoutingModule,
    ValidationModule,
    //PrimeNG
    InputTextModule,
    RadioButtonModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    StepsModule,
  ]
})
export class OrderModule { }
