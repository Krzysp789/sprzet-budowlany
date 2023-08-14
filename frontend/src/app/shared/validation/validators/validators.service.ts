import {
  DatePipe,
  formatDate,
} from '@angular/common';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
} from '@angular/forms';

import { Delivery } from 'src/app/core/enums/delivery.enum';
import { ItemStatus } from 'src/app/core/enums/item-status.enum';
import { Payment } from 'src/app/core/enums/payment.enum';
import { RentStatus } from 'src/app/core/enums/rent-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor(private datePipe: DatePipe) { }

  afterEqualDate(dateAfterEqual: string, date: string | string[]) {
    return (formGroup: AbstractControl) => {
      const dateAfterEqualControl = formGroup.get(dateAfterEqual);
      if(!dateAfterEqualControl) return null;

      if(typeof date == "string") {
        const dateControl = formGroup.get(date);

        if (!dateControl) return null;

        if (dateControl.errors && !dateControl.errors['notAfterEqual']) {
          return null;
        }

        if (dateControl.value < dateAfterEqualControl.value) {
          dateControl.setErrors({
            notAfterEqual: this.datePipe.transform(dateAfterEqualControl.value, 'shortDate')
          });
          return { notAfterEqual: this.datePipe.transform(dateAfterEqualControl.value, 'shortDate') };
        } else {
          dateControl.setErrors(null);
          return null;
        }
      } else {
        const dateControl: FormControl[] = [];
        date.forEach( x => { dateControl.push(<FormControl>formGroup.get(x)); });

        dateControl.forEach( (x: FormControl) => {
          if (x.value < dateAfterEqualControl.value) {
            x.setErrors({
              notAfterEqual: this.datePipe.transform(dateAfterEqualControl.value, 'shortDate')
            });
          } else {
            x.setErrors(null);
          }
        });
        return null;
      }
    }
  }

  afterEqualToday(control: AbstractControl): ValidationErrors | null {
    const date: string = formatDate(new Date(), 'yyyy-MM-dd', 'pl');

    return control.value < date ?
      { notAfterEqual: this.datePipe.transform(new Date(date), 'shortDate') } :
      null;
  }

  existDeliveryValidator(control: AbstractControl): ValidationErrors | null {
    if (Object.values(Delivery).includes(control.value)) {
      return null;
    }
    return { notExist: true };
  }

  existItemStatusValidator(control: AbstractControl): ValidationErrors | null {
    if (Object.values(ItemStatus).includes(control.value)) {
      return null;
    }
    return { notExist: true };
  }

  existPaymentValidator(control: AbstractControl): ValidationErrors | null {
    if (Object.values(Payment).includes(control.value)) {
      return null;
    }
    return { notExist: true };
  }

  existRentStatusValidator(control: AbstractControl): ValidationErrors | null {
    if (Object.values(RentStatus).includes(control.value)) {
      return null;
    }
    return { notExist: true };
  }

  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors["mustMatch"]
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
