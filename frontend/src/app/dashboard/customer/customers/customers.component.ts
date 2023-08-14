import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Collection } from 'src/app/core/interfaces/collection';
import { Customer } from 'src/app/core/interfaces/customer';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';

import { DataService } from '../../../core/services/data.service';
import {
  CustomerAddEditComponent,
} from '../customer-add-edit/customer-add-edit.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: []
})
export class CustomersComponent implements OnDestroy {
  customers: Collection<Customer> = { data: [], total: 0 };
  id: number;
  ref: DynamicDialogRef;
  loading: boolean = true;
  event: LazyLoadEvent | null;
  @ViewChild('globalFilter') globalFilter: ElementRef;
  @ViewChild('dt1') dt1: Table;

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) { }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  clearGlobalFilter(): void {
    this.globalFilter.nativeElement.value = '';
    this.dt1.filterGlobal('', 'contains')
  }

  loadCustomers(event: LazyLoadEvent | null = null): void {
    this.loading = true;
    this.event = event;
    this.dataService.customersIndex(event).subscribe(res => {
      this.customers = res;
      this.loading = false;
    });
  }

  deleteCustomer(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć klienta ${customer.first_name} ${customer.last_name}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.customersDestroy(customer.id).subscribe({
          next: (res: OperationResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
            this.loadCustomers(this.event);
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

  showDialog(customer: Customer | null = null): void {
    let header = customer == null ? 'Dodaj nowego klienta' :
      'Edytuj klienta ' + customer.first_name + ' ' + customer.last_name;
    this.ref = this.dialogService.open(CustomerAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        id: customer == null ? null : customer.id,
        edit: customer == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.loadCustomers(this.event));
  }
}
