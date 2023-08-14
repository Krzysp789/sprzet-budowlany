import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

import { ValidationModule } from '../shared/validation/validation.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'zaloguj', component: LoginComponent },
      { path: 'zarejestruj', component: RegisterComponent },
    ]
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    ValidationModule,
    //PrimeNG
    CardModule,
    InputTextModule,
    ButtonModule,
    MessagesModule,
  ]
})
export class AuthModule { }
