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
  getItemStatusValue,
  ItemStatusTable,
} from 'src/app/core/enums/item-status.enum';
import { Item } from 'src/app/core/interfaces/item';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { ItemModel } from 'src/app/core/models/item.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-equipment-item-add-edit',
  templateUrl: './equipment-item-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ]
})
export class EquipmentItemAddEditComponent implements OnInit {
  item = new ItemModel();
  itemStatusTable = ItemStatusTable;
  itemSN: string;
  idEquipment: number;
  idItem: number;
  edit: boolean = false;

  constructor(
    private dataService: DataService,
    public messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.data) {
      this.idItem = this.config.data.idItem;
      this.idEquipment = this.config.data.idEquipment;
      this.edit = this.config.data.edit;
    }
    if (this.edit) this.getItem();
  }

  getItem(): void {
    this.dataService.equipmentItemsShow(this.idEquipment, this.idItem).subscribe(
      (res: Item) => {
        this.item = res;
        this.item.status = getItemStatusValue(<string>this.item.status);
        this.itemSN = res.serial_number;
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
      this.dataService.equipmentItemsStore(this.item, this.idEquipment).subscribe({
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
      this.dataService.equipmentItemsUpdate(
        this.item, this.idEquipment, this.idItem
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
