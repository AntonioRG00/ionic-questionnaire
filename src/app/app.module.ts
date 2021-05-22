import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SplashComponent } from './components/splash/splash.component';

@NgModule({
  declarations: [AppComponent,
  ],
  entryComponents: [],
  imports: [HttpClientModule, HttpClientInMemoryWebApiModule, BrowserModule, BrowserAnimationsModule,
    IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, ChartModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
