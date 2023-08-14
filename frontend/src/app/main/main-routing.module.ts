import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { CustomerGuard } from '../core/guards/customer.guard';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: LandingComponent },
      {
        path: 'oferta',
        loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule),
        data: { preload: true }
      },
      {
        path: 'koszyk',
        loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
        data: { preload: true }
      },
      {
        path: 'zamowienie',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
        canActivate: [CustomerGuard]
      },
      {
        path: 'wypozyczenia',
        loadComponent: () => import('./user-rents/user-rents.component').then(m => m.UserRentsComponent),
        canMatch: [CustomerGuard]
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
