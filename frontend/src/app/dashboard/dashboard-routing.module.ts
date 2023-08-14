import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import {
  CategoriesComponent,
} from './category/categories/categories.component';
import {
  CustomerDetailComponent,
} from './customer/customer-detail/customer-detail.component';
import {
  customerDeatailResolver,
} from './customer/customer-detail/customer-detail.resolver';
import { CustomersComponent } from './customer/customers/customers.component';
import {
  DashboardLandingComponent,
} from './dashboard-landing/dashboard-landing.component';
import { DashboardComponent } from './dashboard.component';
import {
  EquipmentDetailComponent,
} from './equipment/equipment-detail/equipment-detail.component';
import {
  equipmentDeatailResolver,
} from './equipment/equipment-detail/equipment-detail.resolver';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import {
  RentalDetailComponent,
} from './rental/rental-detail/rental-detail.component';
import {
  rentalDeatailResolver,
} from './rental/rental-detail/rental-detail.resolver';
import { RentalsComponent } from './rental/rentals/rentals.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardLandingComponent,
      },
      {
        path: 'kategorie', component: CategoriesComponent,
      },
      {
        path: 'sprzet', component: EquipmentComponent,
      },
      {
        path: 'sprzet/:id',
        component: EquipmentDetailComponent,
        resolve: {
          equipment: equipmentDeatailResolver
        }
      },
      {
        path: 'klienci', component: CustomersComponent,
      },
      {
        path: 'klienci/:id',
        component: CustomerDetailComponent,
        resolve: {
          customer: customerDeatailResolver
        }
      },
      {
        path: 'wypozyczenia', component: RentalsComponent,
      },
      {
        path: 'wypozyczenia/:id',
        component: RentalDetailComponent,
        resolve: {
          rental: rentalDeatailResolver
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
