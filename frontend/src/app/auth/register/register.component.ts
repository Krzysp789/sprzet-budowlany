import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  Message,
  MessageService,
} from 'primeng/api';
import {
  AsyncValidatorsService,
} from 'src/app/shared/validation/async-validators/async-validators.service';
import {
  ValidatorsService,
} from 'src/app/shared/validation/validators/validators.service';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
    input.ng-invalid.ng-touched:not(:focus),
    form.ng-submitted input.ng-invalid:not(:focus) {
      color: rgb(127 29 29);
      background-color: rgb(254 226 226);
      border-color: rgb(248 113 113);
    }
  `],
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    name: ['', {
      validators: [Validators.required],
      updateOn: 'submit'
    }],
    email: ['', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.asyncValidators.uniqueEmail()],
      updateOn: 'blur'
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur'
    }],
    confirmPassword: ['', {
      validators: [Validators.required,],
      updateOn: 'submit'
    }],
    first_name: ['', {
      validators: [Validators.required,],
      updateOn: 'submit'
    }],
    last_name: ['', {
      validators: [Validators.required,],
      updateOn: 'submit'
    }],
    phone_no: ['', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'submit'
    }],
  }, {
    validators: [this.validators.matchPassword('password', 'confirmPassword')],
  });
  messages: Message[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validators: ValidatorsService,
    private asyncValidators: AsyncValidatorsService,
    public messageService: MessageService
  ) { }

  submit(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Rejestracja udana',
          detail: `Pomyślnie zarejestrowano użytkownika ${this.registerForm.controls['name'].value}`
        });
        this.router.navigate(['']);
      },
      error: (res: HttpErrorResponse) => {
        if (res.status == 422) {
          this.messages = [{ severity: 'error', summary: res.error.message }];
        }
      }
    });
  }
}
