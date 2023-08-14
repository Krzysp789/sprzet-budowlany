import { Component } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-employees',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  providers: [ConfirmationService, DialogService]
})
export class DashboardComponent { }
