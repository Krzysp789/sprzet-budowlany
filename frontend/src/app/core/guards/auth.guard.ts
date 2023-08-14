import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import {
  catchError,
  map,
  Observable,
  of,
} from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  private guard(state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getUserData().pipe(
      map(() => true),
      catchError(res => {
        if (res.status == 401) {
          this.authService.returnUrl = state.url;
          this.router.navigate(['zaloguj']);
        }
        return of(false);
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.guard(state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.guard(state);
  }

  canMatch(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.guard(state);
  }
}
