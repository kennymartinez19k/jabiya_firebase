import { Component, Input, OnInit } from '@angular/core';
import { OrderLine } from 'src/app/interfaces/order-line.interface';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: any;
  @Input() productIndex: number;
  editValue = false 
  activeInput = false
  valueInput = null
  constructor(private _shoppingCartService: ShoppingCartService, private router: Router,
  ) { }

  ngOnInit() { }

  reduceProductQuantity() {
    if (this.product.quantity - 1 < 0) return;

    if(this.product.quantity == this.product.minimum_order_qty){
      this.product.quantity = 0
    }else{
      this.product.quantity = this.product.quantity - 1
    }
  }
  focusValue(){
    this.activeInput = true
  }

  async changeQuantity(e){
    let delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1500)

    let qty = Math.floor(Number(e.target.value))

    if(qty > 0 && qty < this.product.minimum_order_qty){
      this.product.quantity = this.product.minimum_order_qty
      e.target.value = Number(this.product.quantity)

    }

    else if(qty > this.product.free_qty) {
      this.product.quantity = this.product.free_qty
      e.target.value = Number(this.product.quantity)


    }else if(qty < 0 ||  qty == null){
      this.product.quantity = 0
      e.target.value = Number(this.product.quantity)


    }else{
      this.product.quantity =  Number(e.target.value)
      e.target.value = Number(this.product.quantity)

    }
  }



  goToProductDetails(product): void {
    const navigationExtras: NavigationExtras = {
      state: {
        productDetails: product,
      },
    };
    this.router.navigate(['../product-details'], navigationExtras);
  }

  removeProduct() {
    this._shoppingCartService.orderLines.splice(this.productIndex, 1)
  }
  addProduct() {
    const existsProduct = this._shoppingCartService.orderLines.find(ol => ol.productId == this.product.id)
    if (existsProduct) {
      existsProduct.quantity = existsProduct.quantity + this.product.quantity
    } else {
      this._shoppingCartService.addOrderLine({
        free_qty: this.product.free_qty,
        minimum_order_qty: this.product.minimum_order_qty,
        available_threshold: this.product.available_threshold,
        productId: this.product.id,
        productName: this.product.name,
        price_before_tax: this.product.price_before_tax,
        price: this.product.price,
        oldPrice: this.product.old_price,
        quantity: this.product.quantity,
        image_url: this.product.image_url,
        image_hash: this.product.image_hash,
        is_discount: this.product.is_discount,
        productCategories: this.product.productCategories,
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
    this.product.quantity = 0
  }
  round(value) {
    if (!value || typeof (value) != 'number') return value;
    if (value == NaN) return 0;

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
    return formatter.format(value).replace('DOP', 'RD$');;
  }
 
  addProductQuantity(){
    if(this.product.quantity == this.product.free_qty) return ;

    if(this.product.quantity == 0 && this.product.minimum_order_qty > 0){
      this.product.quantity = this.product.minimum_order_qty
    }else{
      this.product.quantity = this.product.quantity + 1
    }
  }
}
