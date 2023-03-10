import { SharedComponentsModule } from '../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PointsPageRoutingModule } from './points-routing.module';

import { PointsPage } from './points.page';

@NgModule({
  imports: [SharedComponentsModule, CommonModule, FormsModule, IonicModule, PointsPageRoutingModule],
  declarations: [PointsPage],
})
export class PointsPageModule {}
