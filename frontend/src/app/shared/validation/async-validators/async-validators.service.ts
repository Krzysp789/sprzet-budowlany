import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import {
  map,
  Observable,
} from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsService {

  constructor(private dataService: DataService) { }

  existAddress(idCustomer: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.customersAddressesSearch(
        'id', control.value, idCustomer
      ).pipe(
        map((res) => {
          return res ? null : { notExist: true }
        }),
      );
    }
  }

  existCategory(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.categoriesSearch('id', control.value).pipe(
        map((res) => {
          return res ? null : { notExist: true }
        }),
      );
    }
  }

  existCustomer(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.customersSearch('id', control.value).pipe(
        map((res) => {
          return res ? null : { notExist: true }
        }),
      );
    }
  }

  existItem(idEquipment: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.itemsSearch('id', control.value, idEquipment).pipe(
        map((res) => {
          return res ? null : { notExist: true }
        }),
      );
    }
  }

  uniqueCategory(categoryName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.categoriesSearch('name', control.value).pipe(
        map((res) => {
          return res && control.value !== categoryName ? { exist: true } : null
        }),
      );
    }
  }

  uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.usersSearch(control.value).pipe(
        map((res) => {
          return res ? { exist: true } : null
        }),
      );
    }
  }

  uniqueEquipment(equipmentName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.equipmentSearch('name', control.value).pipe(
        map((res) => {
          return res && control.value !== equipmentName ? { exist: true } : null
        }),
      );
    }
  }

  uniqueItemInRental(idItem: number, idRental: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.rentalsItemsSearch(control.value, idRental).pipe(
        map((res) => {
          return res && control.value !== idItem ? { exist: true } : null
        }),
      );
    }
  }

  uniqueItem(itemSN: string, idEquipment: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.itemsSearch(
        'serial_number', control.value, idEquipment
      ).pipe(
        map((res) => {
          return res && control.value !== itemSN ? { exist: true } : null
        }),
      );
    }
  }
}
