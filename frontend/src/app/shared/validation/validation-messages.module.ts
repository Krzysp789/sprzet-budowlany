import { NgModule } from '@angular/core';

import { VALIDATION_MESSAGES } from './validation-messages.token';

@NgModule({
  providers: [
    {
      provide: VALIDATION_MESSAGES,
      useValue: {
        required: (name: any) => `Pole ${name} jest wymagane.`,
        email: (name: any) => `Pole ${name} musi być prawidłowym adresem email.`,
        min: (name: any, details: any) =>
          `Pole ${name} nie może być mniejsze niż ${details.min}.`,
        max: (name: any, details: any) =>
          `Pole ${name} nie może być większe niż ${details.max}.`,
        minlength: (name: any, details: any) =>
          `Pole ${name} musi być minimalnej długości ${details.requiredLength}.`,
        maxlength: (name: any, details: any) =>
          `Pole ${name} musi być maksymalnej długości ${details.requiredLength}.`,
        pattern: (name: any) => `Pole ${name} ma niepoprawny format.`,
        exist: (name: any) => `${name} już istnieje.`,
        notExist: (name: any) => `${name} nie istnieje.`,
        modelExist: (name: any) => `${name} już istnieje dla tej marki.`,
        notAfter: (name: any, details: any) =>
          `Pole ${name} musi być po ${details}.`,
        notAfterEqual: (name: any, details: any) =>
          `Pole ${name} nie może być przed ${details}.`,
        notBefore: (name: any, details: any) =>
          `Pole ${name} musi być przed ${details}.`,
        mustMatch: (name: any) => `Pole ${name} musi być takie same.`,
        invalidFormat: (name: any) => `Pole ${name} musi być w poprawnym formacie.`,
      },
      multi: true,
    },
  ]
})
export class ValidationMessagesModule { }
