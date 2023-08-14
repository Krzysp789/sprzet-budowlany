import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  DEFAULT_CURRENCY_CODE,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';
import { ToastModule } from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MainModule,
    AppRoutingModule,
    //primeng
    ToastModule
  ],
  exports: [],
  providers: [
    CookieService,
    DatePipe,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'PLN' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
