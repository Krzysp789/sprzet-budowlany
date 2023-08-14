import {
  Inject,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import {
  VALIDATION_MESSAGES,
  ValidationMessages,
} from './validation-messages.token';

@Pipe({ name: 'validate' })
export class ValidatePipe implements PipeTransform {
  readonly validationMessage = this.validationMessages.reduce(
    (all, entry) => ({ ...all, ...entry }),
    {} as ValidationMessages,
  )

  constructor(
    @Inject(VALIDATION_MESSAGES)
    readonly validationMessages: ValidationMessages[],
  ) { }

  transform(validationErrors: ValidationErrors | null, name: any = '') {
    const [error] = Object.entries(validationErrors || {})
    if (!error) {
      return ''
    }

    const [errorKey, errorDetails] = error
    const template = this.validationMessage[errorKey]
    return template ? template(name, errorDetails) : 'Nieznany błąd'
  }
}
