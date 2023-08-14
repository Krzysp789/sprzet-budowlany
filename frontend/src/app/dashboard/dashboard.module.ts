import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { SharedModule } from '../shared/shared.module';
import { ValidationModule } from '../shared/validation/validation.module';
import {
  CategoriesComponent,
} from './category/categories/categories.component';
import {
  CategoryAddEditComponent,
} from './category/category-add-edit/category-add-edit.component';
import {
  CustomerAddEditComponent,
} from './customer/customer-add-edit/customer-add-edit.component';
import {
  CustomerAddressAddEditComponent,
} from './customer/customer-address-add-edit/customer-address-add-edit.component';
import {
  CustomerDetailComponent,
} from './customer/customer-detail/customer-detail.component';
import { CustomersComponent } from './customer/customers/customers.component';
import {
  DashboardLandingComponent,
} from './dashboard-landing/dashboard-landing.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  EquipmentAddEditComponent,
} from './equipment/equipment-add-edit/equipment-add-edit.component';
import {
  EquipmentDetailComponent,
} from './equipment/equipment-detail/equipment-detail.component';
import {
  EquipmentItemAddEditComponent,
} from './equipment/equipment-item-add-edit/equipment-item-add-edit.component';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  RentalAddEditComponent,
} from './rental/rental-add-edit/rental-add-edit.component';
import {
  RentalDetailComponent,
} from './rental/rental-detail/rental-detail.component';
import {
  RentalItemAddEditComponent,
} from './rental/rental-item-add-edit/rental-item-add-edit.component';
import { RentalsComponent } from './rental/rentals/rentals.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLandingComponent,
    NavbarComponent,
    CategoriesComponent,
    CategoryAddEditComponent,
    EquipmentComponent,
    EquipmentAddEditComponent,
    EquipmentDetailComponent,
    EquipmentItemAddEditComponent,
    CustomersComponent,
    CustomerAddEditComponent,
    CustomerDetailComponent,
    CustomerAddressAddEditComponent,
    RentalsComponent,
    RentalAddEditComponent,
    RentalDetailComponent,
    RentalItemAddEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule,
    ValidationModule,
    //PrimeNG
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    ToggleButtonModule,
    ButtonModule,
    TableModule,
    CardModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    MenubarModule,
    MenuModule,
  ]
})
export class DashboardModule { }
