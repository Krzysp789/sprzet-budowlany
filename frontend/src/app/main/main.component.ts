import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { slideInAnimation } from '../core/animations/routing-animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [],
  animations: [slideInAnimation],
})
export class MainComponent {
  constructor(private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
