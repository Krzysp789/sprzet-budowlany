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
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { Rental } from 'src/app/core/interfaces/rental';

import { DataService } from '../../../core/services/data.service';
import {
  RentalAddEditComponent,
} from '../rental-add-edit/rental-add-edit.component';

@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: []
})
export class RentalsComponent implements OnDestroy {
  rentals: Collection<Rental> = { data: [], total: 0 };
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

  loadRentals(event: LazyLoadEvent | null = null): void {
    this.loading = true;
    this.event = event;
    this.dataService.rentalsIndex(event).subscribe(res => {
      this.rentals = res;
      this.loading = false;
    });
  }

  deleteRental(rental: Rental): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć wypożyczenie #${rental.id}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.rentalsDestroy(rental.id).subscribe({
          next: (res: OperationResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
            this.loadRentals(this.event);
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

  showDialog(rental: Rental | null = null): void {
    let header = rental == null ? 'Dodaj nowe wypożyczenie' :
      'Edytuj wypożyczenie #' + rental.id;
    this.ref = this.dialogService.open(RentalAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        id: rental == null ? null : rental.id,
        edit: rental == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.loadRentals(this.event));
  }
}
