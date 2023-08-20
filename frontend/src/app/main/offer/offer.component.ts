import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { slideInAnimation } from 'src/app/core/animations/routing-animations';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: [],
  animations: [slideInAnimation],
})
export class OfferComponent {
  constructor(private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
