import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { CartService } from '../services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartGuard {

  constructor(
    private router: Router,
    private cartService: CartService
  ) { }

  private guard(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    if (this.cartService.rentDetail.equipment.length > 0) return true;
    else {
      this.router.navigate(['koszyk']);
      return false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    return this.guard(route, state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    return this.guard(route, state);
  }

  canMatch(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    return this.guard(route, state);
  }
}
