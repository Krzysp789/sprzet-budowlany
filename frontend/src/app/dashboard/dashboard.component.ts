import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { slideInAnimation } from '../core/animations/routing-animations';

@Component({
  selector: 'app-employees',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  providers: [ConfirmationService, DialogService],
  animations: [slideInAnimation],
})
export class DashboardComponent {
  constructor(private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
