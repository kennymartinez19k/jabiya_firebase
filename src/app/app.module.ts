import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CodeInputModule } from 'angular-code-input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { JabiyaService } from './services/jabiyaService/jabiya.service';
import myLocaleEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common/';

registerLocaleData(myLocaleEs);

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxPaginationModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: 'abcdef',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    JabiyaService, {provide: LOCALE_ID, useValue: 'es'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
