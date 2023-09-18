import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { env } from 'src/envs/env';

import { AuthStatus } from '../interfaces/auth-status';
import { UserData } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: UserData | null = null;
  loggedOut = new Subject<boolean>();
  returnUrl: string = '/';
  private options = { withCredentials: true };

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {
    if (localStorage.getItem('auth') == null)
      localStorage.setItem('auth', JSON.stringify({}));
    this.userData = JSON.parse(localStorage.getItem('auth') as string);
    if (true) {
      this.getUserData().subscribe(res => {
        this.userData = res;
        localStorage.setItem('auth', JSON.stringify(this.userData));
      });
    }
  }

  setToken(): Observable<any> {
    return this.httpClient.get(`//localhost:8000/sanctum/csrf-cookie`, this.options);
  }

  register(data: any): Observable<any> {
    return this.httpClient.post(`${env.url}/register`, data, this.options);
  }

  login(data: any): Observable<UserData> {
    return this.setToken().pipe(switchMap(() => {
      return this.httpClient.post<UserData>(`${env.url}/login`, data, this.options).pipe(
        map((res: UserData) => {
          this.userData = res;
          localStorage.setItem('auth', JSON.stringify(res));
          let employee = false;
          if (Object.keys(data).length !== 0)
            for (let role of res!.roles) {
              if (role === "employee") employee = true;
              if (role === "admin") employee = true;
            }
          if (employee) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([this.returnUrl]);
            this.returnUrl = '/';
          }
          return res;
        })
      );
    }));
  }

  getUserData(): Observable<UserData> {
    return this.httpClient.get<UserData>(`${env.url}/user`, this.options);
  }

  authStatus(): Observable<AuthStatus> {
    const status = {
      auth: false,
      admin: false,
      employee: false,
      customer: false,
    };
    return this.getUserData().pipe(
      map((res: UserData) => {
        status.auth = true;
        status.admin = res.roles.includes("admin") ? true : false;
        status.employee = res.roles.includes("employee") || res.roles.includes("admin") ?
          true : false;
        status.customer = res.roles.includes("customer") ? true : false;
        return status;
      }),
      catchError(() => of(status))
    );
  }

  logout(): void {
    this.httpClient.post(`${env.url}/logout`, null, this.options).subscribe(() => {
      this.userData = null;
      localStorage.setItem('auth', JSON.stringify({}));
      this.loggedOut.next(true);
      this.router.navigate(['/']);
    });
  }
}
