import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { AuthStatus } from 'src/app/core/interfaces/auth-status';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  userData: UserData | null = this.authService.userData;
  userItems: MenuItem[];
  expanded: boolean = false;
  @ViewChild('menu') menu: Menu;
  items: MenuItem[];
  auth: boolean = false;
  employee: boolean = false;
  customer: boolean = false;
  loggedOutSub: Subscription;
  onShowSub: Subscription;
  onHideSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Oferta',
        routerLink: '/oferta'
      },
    ];
    this.authStatus();
    this.loggedOutSub = this.authService.loggedOut.subscribe({
      next: () => {
        this.auth = this.employee = this.customer = false;
        this.userData = null;
      },
    });
  }

  ngAfterViewInit(): void {
    this.onShowSub = this.menu.onShow.subscribe(() => this.expanded = true);
    this.onHideSub = this.menu.onHide.subscribe(() => this.expanded = false);
  }

  ngOnDestroy(): void {
    this.loggedOutSub.unsubscribe();
    this.onShowSub.unsubscribe();
    this.onHideSub.unsubscribe();
  }

  authStatus(): void {
    this.authService.authStatus().subscribe((res: AuthStatus) => {
      this.auth = res.auth;
      this.employee = res.employee;
      this.customer = res.customer;
      this.userItems = [
        {
          label: 'Dashboard',
          routerLink: '/dashboard',
          visible: this.employee
        },
        {
          label: 'Wypożyczenia',
          routerLink: '/wypozyczenia',
          visible: this.customer
        },
        {
          label: 'Wyloguj',
          command: () => this.authService.logout()
        }
      ];
    });
  }

  isAuth(): boolean {
    return this.auth;
  }
}
