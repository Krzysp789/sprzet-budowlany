import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  insertRemoveAnimation,
} from 'src/app/core/animations/element-animations';
import { Address } from 'src/app/core/interfaces/address';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

import { CartService } from '../../../core/services/cart.service';
import {
  AddressManageComponent,
} from '../address-manage/address-manage.component';

@Component({
  selector: 'app-delivery-payment',
  templateUrl: './delivery-payment.component.html',
  styleUrls: [],
  animations: [insertRemoveAnimation],
})
export class DeliveryPaymentComponent implements OnInit, OnDestroy {
  orderForm = this.formBuilder.group({
    delivery: [this.cartService.rentDetail.delivery, {
      validators: [Validators.required]
    }],
    payment: [this.cartService.rentDetail.payment, {
      validators: [Validators.required]
    }]
  })
  address: Address | null = null;
  userData: UserData = <UserData>this.authService.userData;
  deliverySub: Subscription;
  paymentSub: Subscription;
  ref: DynamicDialogRef;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.getAddressActive();
    this.deliverySub = this.orderForm.controls['delivery'].valueChanges.subscribe(
      (val) => {
        this.cartService.setDelivery(Number(val))
      }
    );
    this.paymentSub = this.orderForm.controls['payment'].valueChanges.subscribe(
      val => {
        this.cartService.setPayment(Number(val))
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.deliverySub.unsubscribe();
    this.paymentSub.unsubscribe();
  }

  getAddressActive(): void {
    this.dataService.selfAddressShowActive().subscribe(res => {
      this.address = res;
      this.cartService.setAddress(this.address.id);
    });
  }

  showAddresses(): void {
    this.ref = this.dialogService.open(AddressManageComponent, {
      header: 'Wybierz adres',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((refresh: boolean) => {
      if (refresh) this.getAddressActive();
    });
  }

  calculateCart(): number {
    return this.cartService.calculateCart();
  }

  calculateDelivery(): number {
    return this.cartService.calculateDelivery();
  }

  calculatePayment(): number {
    return this.cartService.calculatePayment();
  }

  calculateAll(): number {
    return this.cartService.calculateAll();
  }
}
