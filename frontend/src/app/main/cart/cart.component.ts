import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { RentDetail } from 'src/app/core/interfaces/rent-detail';
import { ValidationModule } from 'src/app/shared/validation/validation.module';
import {
  ValidatorsService,
} from 'src/app/shared/validation/validators/validators.service';

import { CartService } from '../../core/services/cart.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    ValidationModule,
    //primeng
    ButtonModule,
    CardModule,
    InputTextModule
  ],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [],
  styles: [`
    input.ng-invalid:not(:focus),
    form input.ng-invalid:not(:focus) {
      color: rgb(127 29 29);
      background-color: rgb(254 226 226);
      border-color: rgb(248 113 113);
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  rentDetail: RentDetail;
  dateForm = this.formBuilder.group({
    dateRental: [this.cartService.rentDetail.dateRental, {
      validators: [
        Validators.required,
        this.validators.afterEqualToday.bind(this.validators)
      ],
    }],
    dateDeadline: [this.cartService.rentDetail.dateDeadline, {
      validators: [Validators.required],
    }],
  }, {
    validators: this.validators.afterEqualDate('dateRental', 'dateDeadline')
  });
  dateRentalSub: Subscription;
  dateDeadlineSub: Subscription;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private validators: ValidatorsService,
  ) { }

  ngOnInit() {
    this.rentDetail = this.cartService.getRentDetail;
    this.dateRentalSub = this.dateForm.controls['dateRental'].valueChanges.subscribe(
      val => {
        if (val != '') this.cartService.setDateRental(<string>val);
      }
    );
    this.dateDeadlineSub = this.dateForm.controls['dateDeadline'].valueChanges.subscribe(
      val => {
        if (val != '') this.cartService.setDateDeadline(<string>val)
      }
    );
  }

  ngOnDestroy() {
    this.dateRentalSub.unsubscribe();
    this.dateDeadlineSub.unsubscribe();
  }

  removeFromCart(equipment: Equipment) {
    this.cartService.removeEquipment(equipment);
    this.rentDetail = this.cartService.getRentDetail;
  }

  clearEquipment() {
    this.cartService.clearEquipment();
    this.rentDetail = this.cartService.getRentDetail;
  }

  increaseEquipment(equipment: Equipment): void {
    if (<number>equipment.quantity < <number>equipment.available_items_count) {
      if (equipment.quantity) equipment.quantity++;
      this.cartService.updateEquipment(equipment);
      this.rentDetail = this.cartService.getRentDetail;
    }
  }

  decreaseEquipment(equipment: Equipment) {
    if (<number>equipment.quantity > 1) {
      if (equipment.quantity) equipment.quantity--;
      this.cartService.updateEquipment(equipment);
      this.rentDetail = this.cartService.getRentDetail;
    }
  }

  calculateSum() {
    return this.cartService.calculateCart();
  }
}
