import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Message } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    input.ng-invalid.ng-touched:not(:focus),
    form.ng-submitted input.ng-invalid:not(:focus) {
      color: rgb(127 29 29);
      background-color: rgb(254 226 226);
      border-color: rgb(248 113 113);
    }
  `]
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur'
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'submit'
    }]
  });
  messages: Message[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  submit(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      error: (res: HttpErrorResponse) => {
        if (res.status == 401) {
          this.loginForm.controls['password'].reset();
          this.messages = [{ severity: 'error', summary: res.error.errors.login }];
        }
      }
    });
  }
}
