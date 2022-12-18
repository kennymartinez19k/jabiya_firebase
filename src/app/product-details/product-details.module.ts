import { SharedComponentsModule } from '../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetails } from './product-details.page';

import { AngularResizeEventModule } from 'angular-resize-event';

@NgModule({
  imports: [SharedComponentsModule, PinchZoomModule, CommonModule, FormsModule, IonicModule, ProductDetailsPageRoutingModule,  AngularResizeEventModule],
  declarations: [ProductDetails],
})
export class ProductDetailsPageModule {}
