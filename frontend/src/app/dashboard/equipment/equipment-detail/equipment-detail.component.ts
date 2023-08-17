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
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { Item } from 'src/app/core/interfaces/item';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';

import { DataService } from '../../../core/services/data.service';
import {
  EquipmentItemAddEditComponent,
} from '../equipment-item-add-edit/equipment-item-add-edit.component';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: []
})
export class EquipmentDetailComponent implements OnInit, OnDestroy {
  id: number = this.route.snapshot.params['id'];
  equipment: Equipment | null;
  idItem: number;
  items: Item[];
  ref: DynamicDialogRef;
  @ViewChild('globalFilter') globalFilter: ElementRef;
  @ViewChild('dt1') dt1: Table;
  imageError: string | null = null;
  fileDrop: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getEquipment();
    this.getEquipmentItems();
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

  getEquipment(): void {
    this.route.data.subscribe(data => this.equipment = data['equipment']);
  }

  getFreshEquipment(): void {
    this.dataService.equipmentShow(this.id).subscribe(res => this.equipment = res);
  }

  getEquipmentItems(): void {
    this.dataService.equipmentItemsIndex(this.id).subscribe((res: Collection<Item>) => {
      this.items = res.data;
    });
  }

  deleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć przedmiot ${item.serial_number}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.equipmentItemsDestroy(this.id, item.id).subscribe({
          next: (res: OperationResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
            this.getEquipmentItems();
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

  showDialog(item: Item | null = null): void {
    let header = item == null ? 'Dodaj nowy przedmiot' :
      'Edytuj przedmiot ' + item.serial_number;
    this.ref = this.dialogService.open(EquipmentItemAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        idItem: item == null ? null : item.id,
        idEquipment: this.id,
        edit: item == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.getEquipmentItems());
  }

  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();
    this.updateImage(event.dataTransfer.files);
  }

  onChange(event: any) {
    this.updateImage(event.target.files);
  }

  updateImage(files: FileList) {
    if (files.length != 1) {
      this.imageError = 'Plik jest wymagany';
      return;
    }

    let image: File = files[0];
    if (!image.type.startsWith("image")) {
      this.imageError = 'Plik musi być grafiką';
      return;
    }

    if ((image.size / 1024) > 512) {
      this.imageError = 'Plik nie może być większy niż 512kB';
      return;
    }

    this.imageError = null;
    let data: FormData = new FormData();
    data.append('image', image, image.name);

    this.dataService.equipmentUpdateImg(data, this.id).subscribe({
      next: (res: OperationResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Zaktualizowano',
          detail: res.message
        });
        this.fileDrop = false;
        this.getFreshEquipment();
      },
      error: (res: HttpErrorResponse) => {
        if (res.status == 422) {
          this.messageService.add({
            severity: 'error',
            summary: 'Wystąpił problem',
            detail: res.error.message
          });
        }
      }
    });
  }
}
