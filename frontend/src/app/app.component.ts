import {
  Component,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  constructor(
    private titleService: Title,
    private config: PrimeNGConfig
  ) {
    this.titleService.setTitle("Wypozyczalnia sprzętu budowlanego");
  }

  ngOnInit(): void {
    this.config.setTranslation({
      accept: 'Tak',
      reject: 'Nie',
    });
  }

}
