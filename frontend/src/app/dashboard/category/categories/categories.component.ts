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
import { Category } from 'src/app/core/interfaces/category';
import { Collection } from 'src/app/core/interfaces/collection';
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';

import { DataService } from '../../../core/services/data.service';
import {
  CategoryAddEditComponent,
} from '../category-add-edit/category-add-edit.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: []
})
export class CategoriesComponent implements OnInit, OnDestroy {
  userData: UserData = <UserData>this.authService.userData;
  categories: Collection<Category> = { data: [], total: 0 };
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
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    public messageService: MessageService,
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
    this.dt1.filterGlobal('', 'contains')
  }

  loadCategories(event: LazyLoadEvent | null = null): void {
    this.loading = true;
    this.event = event;
    this.dataService.categoriesIndex(event).subscribe((res: Collection<Category>) => {
      this.categories = res;
      this.loading = false;
    });
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Czy naprawde chcesz usunąć kategorię ${category.name}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.categoriesDestroy(category.id).subscribe({
          next: (res: OperationResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usunięto',
              detail: res.message
            });
            this.loadCategories(this.event);
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

  showDialog(category: Category | null = null): void {
    let header = category == null ? 'Dodaj nową kategorię' :
      'Edytuj kategorię ' + category.name;
    this.ref = this.dialogService.open(CategoryAddEditComponent, {
      header: header,
      width: '90%',
      styleClass: 'w-full max-w-2xl',
      data: {
        id: category == null ? null : category.id,
        edit: category == null ? false : true
      }
    });

    this.ref.onClose.subscribe(() => {
      this.loadCategories(this.event);
    });
  }
}
