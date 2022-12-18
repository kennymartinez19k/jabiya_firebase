import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryComponent } from './history/history.component';

import { PointsPage } from './points.page';

const routes: Routes = [
  {
    path: '',
    component: PointsPage,
  },
  { path: 'history', component: HistoryComponent },
];
@NgModule({
  declarations: [HistoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointsPageRoutingModule {}
