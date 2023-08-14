import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Address } from 'src/app/core/interfaces/address';
import { Collection } from 'src/app/core/interfaces/collection';
import { Customer } from 'src/app/core/interfaces/customer';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';

import { DataService } from '../../../core/services/data.service';
import {
  CustomerAddressAddEditComponent,
} from '../customer-address-add-edit/customer-address-add-edit.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: []
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customer: Customer | null;
  id: number = this.route.snapshot.params['id'];
  idAddress: number;
  addresses: Address[];
  ref: DynamicDialogRef;
  @ViewChild('globalFilter') globalFilter: ElementRef;
  @ViewChild('dt1') dt1: Table;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getCustomer();
    this.getCustomerAddresses();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  clearGlobalFilter(): void {
    this.globalFilter.nativeElement.value = '';
    this.dt1.filterGlobal('', 'contains')
  }

  getCustomer(): void {
    this.route.data.subscribe(data => this.customer = data['customer']);
  }

  getCustomerAddresses(): void {
    this.dataService.customersAddressesIndex(this.id).subscribe(
      (res: Collection<Address>) => {
        this.addresses = res.data;
      }
    );
  }

  deleteAddress(address: Address): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć adres ${address.street_number}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.customersAddressesDestroy(this.id, address.id).subscribe({
          next: (res: OperationResponse) => {
            this.getCustomerAddresses();
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
          },
          error: (res: HttpErrorResponse) => {
            if (res.status == 409) {
              this.messageService.add({
                severity: 'error',
                summary: 'Wystąpił problem',
                detail: res.error.message
              });
            }
          }
        });
      }
    });
  }

  showDialog(address: Address | null = null): void {
    let header = address == null ? 'Dodaj nowy adres' :
      `Edytuj adres ${address.street_number}`;
    this.ref = this.dialogService.open(CustomerAddressAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        idAddress: address == null ? null : address.id,
        idCustomer: this.id,
        edit: address == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.getCustomerAddresses());
  }
}
