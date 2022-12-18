import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogsPage } from './logs.page';

const routes: Routes = [
  {
    path: '',
    component: LogsPage,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogsPageRoutingModule {}
