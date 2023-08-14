import {
  Component,
  OnDestroy,
} from '@angular/core';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Address } from 'src/app/core/interfaces/address';
import { Collection } from 'src/app/core/interfaces/collection';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

import {
  AddressAddEditComponent,
} from '../address-add-edit/address-add-edit.component';

@Component({
  selector: 'app-address-manage',
  templateUrl: './address-manage.component.html',
  styleUrls: []
})
export class AddressManageComponent implements OnDestroy {
  userData: UserData = <UserData>this.authService.userData;
  addresses: Address[];
  ref2: DynamicDialogRef;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.getAddresses();
  }

  ngOnDestroy(): void {
    if (this.ref2) {
      this.ref2.close();
    }
  }

  getAddresses(): void {
    this.dataService.selfAddressIndex().subscribe((res: Collection<Address>) => {
      this.addresses = res.data;
    });
  }

  selectActive(address: Address): void {
    this.dataService.selfAddressSetActive(address.id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Zmieniono adres',
        detail: `Nowy domyślny adres to ${address.street_number}`
      });
      this.ref.close(true);
    });
  }

  showDialog(address: Address | null = null): void {
    let header = address == null ? 'dodaj nowy adres' : 'edytuj adres';
    this.ref2 = this.dialogService.open(AddressAddEditComponent, {
      header: header,
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        idAddress: address == null ? null : address.id,
        idCustomer: this.userData.customer_id,
        edit: address == null ? false : true
      }
    });

    this.ref2.onClose.subscribe(() => this.getAddresses());
  }

  deleteAddress(address: Address): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć adres ${address.street_number}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.selfAddressDestroy(address.id).subscribe(
          () => this.getAddresses()
        );
      }
    });
  }
}
