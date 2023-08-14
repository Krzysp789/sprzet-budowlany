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
import { OperationResponse } from 'src/app/core/interfaces/operation-response';
import { CategoryModel } from 'src/app/core/models/category.model';

import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: [
    '../../../../assets/scss/validation.scss'
  ]
})
export class CategoryAddEditComponent implements OnInit {
  category = new CategoryModel();
  categoryName: string;
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
    if (this.edit) this.getCategory();
  }

  getCategory(): void {
    this.dataService.categoriesShow(this.id).subscribe((res: Category) => {
      this.category = res;
      this.categoryName = res.name;
    });
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
      this.dataService.categoriesStore(this.category).subscribe({
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
      this.dataService.categoriesUpdate(this.category, this.id).subscribe({
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
    };
  }
}
