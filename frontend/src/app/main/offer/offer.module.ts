import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';

import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { offerDetailResolver } from './offer-detail/offer-detail.resolver';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferComponent } from './offer.component';

const routes: Routes = [
  {
    path: '',
    component: OfferComponent,
    children: [
      {
        path: '',
        component: OfferListComponent,
        data: { animation: 'LeftPage' },
      },
      {
        path: ':id',
        component: OfferDetailComponent,
        resolve: { equipment: offerDetailResolver },
        data: { animation: 'RightPage' },
      },
    ]
  }
];

@NgModule({
  declarations: [
    OfferListComponent,
    OfferDetailComponent,
    OfferComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    //primeng
    CardModule,
    ButtonModule,
    DataViewModule,
    DropdownModule,
  ]
})
export class OfferModule { }
