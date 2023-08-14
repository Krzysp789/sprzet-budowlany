import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
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
import { Subscription } from 'rxjs';
import { AuthStatus } from 'src/app/core/interfaces/auth-status';
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';

import { DataService } from '../../../core/services/data.service';
import {
  EquipmentAddEditComponent,
} from '../equipment-add-edit/equipment-add-edit.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: []
})
export class EquipmentComponent implements OnInit, OnDestroy {
  userData: UserData = <UserData>this.authService.userData;
  equipment: Collection<Equipment> = { data: [], total: 0 };
  id: number;
  ref: DynamicDialogRef;
  loading: boolean = true;
  event: LazyLoadEvent | null;
  admin: boolean = false;
  authStatusSub: Subscription;
  @ViewChild('globalFilter') globalFilter: ElementRef;
  @ViewChild('dt1') dt1: Table;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.authStatus().subscribe(
      (res: AuthStatus) => this.admin = res.admin
    );
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.authStatusSub.unsubscribe();
  }

  clearGlobalFilter(): void {
    this.globalFilter.nativeElement.value = '';
    this.dt1.filterGlobal('', 'contains');
  }

  loadEquipment(event: LazyLoadEvent): void {
    this.loading = true;
    this.event = event;
    this.getEquipmentData(this.event);
  }

  getEquipmentData(event: LazyLoadEvent | null = null): void {
    this.dataService.equipmentIndex(event).subscribe(res => {
      this.equipment = res;
      this.loading = false;
    });
  }

  deleteEquipment(equipment: Equipment): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć sprzęt ${equipment.name}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.equipmentDestroy(equipment.id).subscribe({
          next: (res: OperationResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
            this.getEquipmentData(this.event);
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

  showDialog(equipment: Equipment | null = null): void {
    let header = equipment == null ? 'Dodaj nowy sprzęt' :
      'Edytuj sprzęt ' + equipment.name;
    this.ref = this.dialogService.open(EquipmentAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        id: equipment == null ? null : equipment.id,
        edit: equipment == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => this.getEquipmentData(this.event));
  }
}
