import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //primeng
    CardModule,
    ButtonModule
  ],
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: []
})
export class LandingComponent { }
