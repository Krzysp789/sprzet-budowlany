import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //primeng
    CardModule,
  ],
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: []
})
export class PageNotFoundComponent { }
