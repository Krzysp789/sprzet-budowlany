import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  Router,
} from '@angular/router';

import {
  ConfirmationService,
  MenuItem,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  fadeAppearAnimation,
} from 'src/app/core/animations/routing-animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [],
  providers: [ConfirmationService, DialogService],
  animations: [fadeAppearAnimation],
})
export class OrderComponent implements OnInit {
  items: MenuItem[];
  route: string;

  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts
  ) { }

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

  getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
