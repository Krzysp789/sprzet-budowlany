import {
  Component,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
} from '@angular/router';

import {
  ConfirmationService,
  MenuItem,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [],
  providers: [ConfirmationService, DialogService]
})
export class OrderComponent implements OnInit {
  items: MenuItem[];
  route: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.route = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const nav: NavigationEnd = event;
        this.route = nav.url;
        this.items[2].disabled = this.route == '/zamowienie';
        this.setItems();
      }
    });
    this.setItems();

  }

  setItems(): void {
    this.items = [
      {
        label: 'Koszyk',
        routerLink: ['/koszyk']
      },
      {
        label: 'Dostawa i płatność',
        routerLink: ['./'],
        styleClass: this.route == '/zamowienie/podsumowanie' ? 'not-active' : '',
        disabled: (this.route == '/koszyk')
      },
      {
        label: 'Podsumowanie',
        routerLink: ['./podsumowanie'],
        disabled: (this.route == '/koszyk' || this.route == '/zamowienie'),
      },
    ];
  }
}
