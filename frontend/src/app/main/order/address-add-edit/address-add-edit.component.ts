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
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-address-add-edit',
  templateUrl: './address-add-edit.component.html',
  styleUrls: ['../../../../assets/scss/validation.scss']
})
export class AddressAddEditComponent implements OnInit {
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
    this.dataService.selfAddressShow(this.idAddress).subscribe(
      (res: Address) => this.address = res
    );
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) { return; }
    if (!this.edit) {
      this.dataService.selfAddressStore(this.address).subscribe({
        next: (res: OperationResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Dodano',
            detail: res.message
          });
          this.ref.close();
        },
        error: (res: HttpErrorResponse) => {
          if (res.status == 422) {
            this.messageService.add({
              severity: 'error',
              summary: res.error.header,
              detail: res.error.message
            });
          }
        }
      });
    } else {
      this.dataService.selfAddressUpdate(this.address, this.idAddress).subscribe({
        next: (res: OperationResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Zaktualizowano',
            detail: res.message
          });
          this.ref.close();
        },
        error: (res: HttpErrorResponse) => {
          if (res.status == 422) {
            this.messageService.add({
              severity: 'error',
              summary: res.error.header,
              detail: res.error.message
            });
          }
        }
      });
    };
  }
}
