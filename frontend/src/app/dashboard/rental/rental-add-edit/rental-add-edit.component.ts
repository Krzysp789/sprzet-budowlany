import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  Delivery,
  DeliveryTable,
  getDeliveryValue,
} from 'src/app/core/enums/delivery.enum';
import {
  getPaymentValue,
  PaymentTable,
} from 'src/app/core/enums/payment.enum';
import {
  getRentStatusValue,
  RentalStatusTable,
} from 'src/app/core/enums/rent-status.enum';
import { Address } from 'src/app/core/interfaces/address';
import { Collection } from 'src/app/core/interfaces/collection';
import { Customer } from 'src/app/core/interfaces/customer';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { Rental } from 'src/app/core/interfaces/rental';
import { RentalModel } from 'src/app/core/models/rental.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-rental-add-edit',
  templateUrl: './rental-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ],
  animations: [
    trigger('insertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ],
})
export class RentalAddEditComponent implements OnInit {
  DeliveryEnum = Delivery;
  rental = new RentalModel();
  rentalStatusTable = RentalStatusTable;
  deliveryTable = DeliveryTable;
  paymentTable = PaymentTable;
  customers: Customer[];
  addresses: Address[];
  id: number;
  edit: boolean = false;

  constructor(
    private dataService: DataService,
    public messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.data) {
      this.id = this.config.data.id;
      this.edit = this.config.data.edit;
    }
    if (this.edit) this.getRental();
    else this.rental.paid = false;
    this.getCustomersData();
  }

  getRental(): void {
    this.dataService.rentalsShow(this.id).subscribe((res: Rental) => {
      delete res.total_price;
      this.rental = res;
      this.rental.status = getRentStatusValue(<string>this.rental.status);
      this.rental.delivery = getDeliveryValue(<string>this.rental.delivery);
      this.rental.payment = getPaymentValue(<string>this.rental.payment);
      this.getCustomersAddress(this.rental.customer_id);
    });
  }

  getCustomersData(): void {
    this.dataService.customersIndex().subscribe((res: Collection<Customer>) => {
      this.customers = res.data;
      this.customers = this.customers.map((customers: Customer) => {
        return {
          ...customers,
          labelOption: customers.first_name + ' ' + customers.last_name
        };
      });
    });
  }

  getCustomersAddress(customerId: number): void {
    this.dataService.customersAddressesIndex(customerId).subscribe(
      (res: Collection<Address>) => {
        this.addresses = res.data;
        this.addresses = this.addresses.map((addresses: Address) => {
          return {
            ...addresses,
            labelOption: `${addresses.street_number}, ${addresses.post_code} ${addresses.town}`
          };
        });
      }
    );
  }

  message(type: string, data: OperationResponse): void {
    this.messageService.add({
      severity: type,
      summary: data.header,
      detail: data.message
    });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) { return; }
    if (!this.edit) {
      this.dataService.rentalsStore(this.rental).subscribe({
        next: (res: OperationResponse) => {
          res.header = 'Dodano';
          this.message('success', res);
          this.ref.close();
        },
        error: (res: HttpErrorResponse) => {
          if (res.status == 422) {
            this.message('error', res.error);
          }
        }
      });
    } else {
      this.dataService.rentalsUpdate(this.rental, this.id).subscribe({
        next: (res: OperationResponse) => {
          res.header = 'Zaktualizowano';
          this.message('success', res);
          this.ref.close();
        },
        error: (res: HttpErrorResponse) => {
          if (res.status == 422) {
            this.message('error', res.error);
          }
        }
      });
    }
  }
}
