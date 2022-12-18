import { NgModule, } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { MyAccountPageRoutingModule } from './my-account-routing.module';

import { MyAccountPage } from './my-account.page';
import { AccountsComponent } from './accounts/accounts.component';
import { OrdersComponent } from './orders/orders.component';
import { BillsComponent } from './bills/bills.component';
import { CreditsComponent } from './credits/credits.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CalendarComponent } from './calendar/calendar.component';
import { OrderService } from '../order.service';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { WeekDayPipe } from '../services/week-day.pipe';
// import { FileOpener } from '@ionic-native/file-opener'



import { NgxPaginationModule } from 'ngx-pagination';
import { CartButtonTotalComponent } from '../components/cart-button-total/cart-button-total.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [
    MyAccountPage,
    AccountsComponent,
    BillsComponent,
    OrdersComponent,
    CreditsComponent,
    BillDetailComponent,
    OrderDetailComponent,
    EditAccountComponent,
    WeekDayPipe,
    CalendarComponent,
    CartButtonTotalComponent


  ],
  providers: [OrderService, WeekDayPipe]
})
export class MyAccountPageModule { }
