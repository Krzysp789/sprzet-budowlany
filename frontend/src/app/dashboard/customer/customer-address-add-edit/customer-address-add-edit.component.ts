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
import { Address } from 'src/app/core/interfaces/address';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { AddressModel } from 'src/app/core/models/address.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-address-add-edit',
  templateUrl: './customer-address-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ]
})
export class CustomerAddressAddEditComponent implements OnInit {
  address = new AddressModel();
  idCustomer: number;
  idAddress: number;
  edit: boolean = false;

  constructor(
    private dataService: DataService,
    public messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.data) {
      this.idAddress = this.config.data.idAddress;
      this.idCustomer = this.config.data.idCustomer;
      this.edit = this.config.data.edit;
    }
    if (this.edit) this.getAddress();
  }

  getAddress(): void {
    this.dataService.customersAddressesShow(this.idCustomer, this.idAddress).subscribe(
      (res: Address) => {
        this.address = res;
      });
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
      this.dataService.customersAddressesStore(this.address, this.idCustomer).subscribe({
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
      this.dataService.customersAddressesUpdate(
        this.address, this.idCustomer, this.idAddress
      ).subscribe({
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
    };
  }
}
