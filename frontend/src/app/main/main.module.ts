import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    //primeng
    ButtonModule,
    MenubarModule,
    MenuModule
  ]
})
export class MainModule { }
