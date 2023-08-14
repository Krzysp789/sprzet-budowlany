import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Address } from 'src/app/core/interfaces/address';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { RentDetail } from 'src/app/core/interfaces/rent-detail';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { env } from 'src/envs/env';

import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: []
})
export class SummaryComponent implements OnInit {
  rentDetail: RentDetail = this.cartService.getRentDetail;
  bankAccount = env.bankAccount;
  userData: UserData = <UserData>this.authService.userData;
  address: Address | null = null;

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    public messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAddressActive();
  }

  rent(): void {
    this.dataService.storeRent(this.rentDetail).subscribe({
      next: (res: OperationResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Dodano do relalizacji',
          detail: res.message
        });
      },
      error: (res: HttpErrorResponse) => {
        if (res.status == 422) {
          this.messageService.add({
            severity: 'error',
            summary: 'Wystąpił błąd podczas realizacji wypożyczenia',
            detail: res.error.message
          });
        }
      }
    });
    this.cartService.clearEquipment();
    this.router.navigate(['']);
  }

  getAddressActive(): void {
    this.dataService.selfAddressShowActive().subscribe(res => this.address = res);
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

  calculateDays(): number {
    return this.cartService.calculateDays();
  }
}
