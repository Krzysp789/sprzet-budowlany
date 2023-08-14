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
import { Category } from 'src/app/core/interfaces/category';
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { EquipmentModel } from 'src/app/core/models/equipment.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-equipment-add-edit',
  templateUrl: './equipment-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ]
})
export class EquipmentAddEditComponent implements OnInit {
  equipment = new EquipmentModel();
  categories: Category[];
  equipmentName: string;
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
    if (this.edit) this.getEquipment();
    this.getCategoriesData();
  }

  getEquipment(): void {
    this.dataService.equipmentShow(this.id).subscribe((res: Equipment) => {
      this.equipment = res;
      this.equipmentName = res.name;
    });
  }

  getCategoriesData(): void {
    this.dataService.categoriesIndex().subscribe(
      (res: Collection<Category>) => this.categories = res.data
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
      this.dataService.equipmentStore(this.equipment).subscribe({
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
      this.dataService.equipmentUpdate(this.equipment, this.id).subscribe({
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
