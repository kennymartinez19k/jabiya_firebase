import { Component, OnInit, OnDestroy, NgModule, HostListener } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { ResizedEvent } from 'angular-resize-event';

import 'hammerjs'
import { hammerjs } from 'node_modules/hammerjs'



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

export class ProductDetails implements OnInit , OnDestroy {
  
  public languageJson = {
   
  };
  public language: any;
  public loading = false;
  public userData: any
  public hammerjs = hammerjs
  public productDetails: any
  public scale = 0
  click = 0
  sliderOpt = {
    zoom:{
      maxRatio: 2
    }
  }

  
   
  constructor(public _shoppingCartService: ShoppingCartService, private landingPageService: LandingPageService, public sanitizer: DomSanitizer, private router: Router ) {
    this.language = localStorage.getItem(LANGUAGE);
    // Storage.get({ key: 'userData' }).then((result) => {
      
      const userData = JSON.parse(localStorage.getItem('userData'))
  }

  formatImage(url, format = 'image_1920'){
    return url.replace("image_128", format)
  }
  formatHash(hash){
    return 'image_1920' + hash
  }
 
  ngOnInit() {
    this.getUserData()
    let productDetails = this.router.getCurrentNavigation().extras.state.productDetails;
    this.productDetails = productDetails 
   
  }
 
  zoom(){
      if (this.scale){
        this.scale = 0
      }else{
        this.scale = 1
      }
  }
  
  ngOnDestroy() {
    this.loading = false
  }

  reduceProductQuantity() {
    if (this.productDetails.quantity - 1 < 0) return;

    if(this.productDetails?.quantity == this.productDetails?.minimum_order_qty){
      this.productDetails.quantity = 0
    }else{
      this.productDetails.quantity = this.productDetails?.quantity - 1
    }
  }

  addProductQuantity(){
    if(this.productDetails.quantity == this.productDetails.free_qty) return ;

    if(this.productDetails.quantity == 0 && this.productDetails.minimum_order_qty > 0){
      this.productDetails.quantity = this.productDetails.minimum_order_qty
    }else{
      this.productDetails.quantity = this.productDetails.quantity + 1
    }
  }
  async changeQuantity(e){
    let delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1500)
    
    let qty = Math.floor(Number(e.target.value))
    
    if(qty > 0 && qty < this.productDetails.minimum_order_qty){
      this.productDetails.quantity = this.productDetails.minimum_order_qty
      e.target.value = Number(this.productDetails.quantity)
    }
    else if(qty > this.productDetails.free_qty) {
      this.productDetails.quantity = this.productDetails.free_qty
      e.target.value = Number(this.productDetails.quantity)
    }else if(qty < 0 ||  qty == null){
      this.productDetails.quantity = 0
      e.target.value = Number(this.productDetails.quantity)
    }else{
      this.productDetails.quantity =  Number(e.target.value)
      e.target.value = Number(this.productDetails.quantity)
    }
  }


  round(value){
    if (!value || typeof(value) != 'number') return value;
    if (value == NaN ) return 0;

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });

    return formatter.format(value).replace('DOP', 'RD$').replace('DOP', 'RD$');;
  }


  addProduct() {
    const existsProduct = this._shoppingCartService.orderLines.find(ol => ol.productId == this.productDetails.id)
    if (existsProduct) {
      existsProduct.quantity += this.productDetails.quantity
    } else {
      this._shoppingCartService.addOrderLine({
        free_qty: this.productDetails.free_qty,
        minimum_order_qty: this.productDetails.minimum_order_qty,
        available_threshold: this.productDetails.available_threshold,
        productId: this.productDetails.id,
        productName: this.productDetails.name,
        price_before_tax: this.productDetails.price_before_tax,
        price: this.productDetails.price,
        oldPrice: this.productDetails.old_price,
        quantity: this.productDetails.quantity,
        image_url: this.productDetails.image_url,
        image_hash: this.productDetails.image_hash,
        is_discount: this.productDetails.is_discount,
        productCategories: this.productDetails.productCategories,
        line_id: undefined,
        isRewardLine: undefined,
        productImage: undefined,
        productPriceSubtotal: undefined,
        productPriceTax: undefined,
        productPriceTotal: undefined,
        qtyAvailableToday: undefined,
        currencySymbol: undefined,
        currencyUnitLabel: undefined,
        currencySubUnitLabel: undefined,
        order_line_changes: undefined,
        taxes: undefined,
      })
    }
    this.productDetails.quantity = 0
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }
}
