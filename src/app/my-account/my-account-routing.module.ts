import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { BillsComponent } from './bills/bills.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreditsComponent } from './credits/credits.component';
import { EditAccountComponent } from './edit-account/edit-account.component';

import { MyAccountPage } from './my-account.page';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountPage 
  },
  { path: 'orders', component: OrdersComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'billDetails/:id', component: BillDetailComponent },
  { path: 'orderDetails', component: OrderDetailComponent },
  { path: 'editAccount', component: EditAccountComponent },
  { path: 'calendar', component: CalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountPageRoutingModule {}
