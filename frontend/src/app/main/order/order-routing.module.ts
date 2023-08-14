import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { CartGuard } from 'src/app/core/guards/cart.guard';

import {
  DeliveryPaymentComponent,
} from './delivery-payment/delivery-payment.component';
import { OrderComponent } from './order.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [CartGuard],
    children: [
      {
        path: '',
        component: DeliveryPaymentComponent,
      },
      {
        path: 'podsumowanie',
        component: SummaryComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
