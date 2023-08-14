import {
  Component,
  ViewChild,
} from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  userData: UserData = <UserData>this.authService.userData;
  expanded: boolean = false;
  items: MenuItem[];
  userItems: MenuItem[];
  onShowSub: Subscription;
  onHideSub: Subscription;
  @ViewChild('menu') menu: Menu;

  constructor(private authService: AuthService) { }
  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        routerLinkActiveOptions: { exact: true },
        routerLink: './'
      },
      {
        label: 'Kategorie',
        routerLink: './kategorie'
      },
      {
        label: 'Sprzęt',
        routerLink: './sprzet'
      },
      {
        label: 'Klienci',
        routerLink: './klienci'
      },
      {
        label: 'Wypożyczenia',
        routerLink: './wypozyczenia'
      }
    ];
    this.userItems = [
      {
        label: 'Wyloguj',
        command: () => this.authService.logout()
      }
    ];
  }

  ngAfterViewInit() {
    this.onShowSub = this.menu.onShow.subscribe(() => this.expanded = true);
    this.onHideSub = this.menu.onHide.subscribe(() => this.expanded = false);
  }

  ngOnDestroy() {
    this.onShowSub.unsubscribe();
    this.onHideSub.unsubscribe();
  }
}
