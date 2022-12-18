// import { RoundValuePipe } from '../services/round.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { IonicModule } from '@ionic/angular';
import { CartAddressComponent } from './cart-address/cart-address.component';
import { CartProductImageComponent } from './cart-product-image/cart-product-image.component';
import { CartTotalsComponent } from './cart-totals/cart-totals.component';
import { CartPaymentTypeComponent } from './cart-payment-type/cart-payment-type.component';
import { CartDeliveryDateComponent } from './cart-delivery-date/cart-delivery-date.component';
import { CartPointsComponent } from './cart-points/cart-points.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { CartButtonTotalComponent } from './cart-button-total/cart-button-total.component';
import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { PipeModule } from '../services/round.pipe';

@NgModule({
  declarations: [ CachedImageComponent, CartAddressComponent, CartProductImageComponent, CartTotalsComponent, CartPaymentTypeComponent, CartDeliveryDateComponent, CartPointsComponent, ProductItemComponent, CartButtonTotalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    // FormsModule,
    // PipeModule.forRoot()
  ],
  exports: [CachedImageComponent, CartAddressComponent, CartProductImageComponent, CartTotalsComponent, CartPaymentTypeComponent, CartDeliveryDateComponent, CartPointsComponent, CartButtonTotalComponent, ProductItemComponent],
})
export class SharedComponentsModule { }
