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
import { Rental } from 'src/app/core/interfaces/rental';

import { DataService } from '../../../core/services/data.service';
import {
  RentalItemAddEditComponent,
} from '../rental-item-add-edit/rental-item-add-edit.component';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: []
})
export class RentalDetailComponent implements OnInit, OnDestroy {
  rental: Rental | null;
  id: number;
  idItem: number;
  items: Item[];
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
    this.id = this.route.snapshot.params['id'];
    this.getRental();
    this.getRentalItems();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  clearGlobalFilter(): void {
    this.globalFilter.nativeElement.value = '';
    this.dt1.filterGlobal('', 'contains');
  }

  getRental(): void {
    this.route.data.subscribe(data => this.rental = data['rental']);
  }

  getRentalItems(): void {
    this.dataService.rentalsItemsIndex(this.id).subscribe(
      (res: Collection<Item>) => this.items = res.data
    );
  }

  calculateItemTotal(equipment_id: number): number {
    let total = 0;
    if (this.rental?.items) {
      for (let item of this.rental.items) {
        if (item.equipment?.id === equipment_id) {
          total++;
        }
      }
    }
    return total;
  }

  deleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć przedmiot ${item.serial_number} z wypożyczenia #${this.id}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.rentalsItemsDestroy(this.id, item.id).subscribe(() => {
          this.getRentalItems();
          this.messageService.add({
            severity: 'success',
            summary: 'Usunięto',
            detail: `Pomyślnie usunięto przedmiot ${item.serial_number} z wypożyczenia #${this.id}`
          });
        });
      }
    });
  }

  deleteEquipment(equipment: Equipment): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć cały sprzęt ${equipment.name} z wypożyczenia #${this.id}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.rentalsEquipmentDestroy(this.id, equipment.id).subscribe(() => {
          this.getRentalItems();
        })
        this.messageService.add({
          severity: 'success',
          summary: 'Usunięto',
          detail: `Pomyślnie usunięto sprzęt ${equipment.name} z wypożyczenia #${this.id}`
        });
      }
    });
  }

  showDialog(item: Item | null = null): void {
    let header = item == null ? 'Dodaj sprzęt do wypożyczenia' :
      `Edytuj przedmiot ${item.serial_number} w wypożyczeniu #${this.id}`;
    this.ref = this.dialogService.open(RentalItemAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        idItem: item == null ? null : item.id,
        idRental: this.id,
        edit: item == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.getRentalItems());
  }
}
