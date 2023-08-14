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
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { Item } from 'src/app/core/interfaces/item';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { RentalItemModel } from 'src/app/core/models/rental-item.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-rental-item-add-edit',
  templateUrl: './rental-item-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ]
})
export class RentalItemAddEditComponent implements OnInit {
  rentalItem = new RentalItemModel();
  itemId: number;
  idRental: number;
  idItem: number;
  equipment: Equipment[];
  available: number;
  items: Item[];
  edit: boolean = false;

  constructor(
    private dataService: DataService,
    public messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.rentalItem.type = "single";
    if (this.config && this.config.data) {
      this.idItem = this.config.data.idItem;
      this.idRental = this.config.data.idRental;
      this.edit = this.config.data.edit;
    }
    this.getEquipment()
    if (this.edit) this.getItem();
  }

  getItem(): void {
    this.dataService.rentalsItemsShow(this.idRental, this.idItem).subscribe(
      (res: Item) => {
        this.itemId = res.id;
        this.rentalItem.pivot.price = res.price
      }
    );
  }

  getEquipment(): void {
    this.dataService.equipmentIndex().subscribe((res: Collection<Equipment>) => {
      this.equipment = res.data;
      this.equipment = this.equipment.map((equipment: Equipment) => {
        return {
          ...equipment,
          labelOption: equipment.name + ', Dostępna ilość: ' +
            equipment.available_items_count,
        };
      });
    });
  }

  equipmentSet(idEquipment: number): void {
    let eq: Equipment = <Equipment>this.equipment.find(
      (x: { id: number }) => x.id === idEquipment
    );
    this.items = <Item[]>eq?.items?.filter(
      (item: { status: string | number }) => item.status === 'dostępny'
    );
    this.rentalItem.pivot.price = eq.price;
    this.available = <number>eq.available_items_count;
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
    if (!this.edit && this.rentalItem.type === "single") {
      this.dataService.rentalsItemsStore(this.rentalItem, this.idRental).subscribe({
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
    } else if (!this.edit && this.rentalItem.type === "multiple") {
      this.dataService.rentalsEquipmentStore(this.rentalItem, this.idRental).subscribe({
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
      this.dataService.rentalsItemsUpdate(
        this.rentalItem, this.idRental, this.idItem
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
    }
  }
}
