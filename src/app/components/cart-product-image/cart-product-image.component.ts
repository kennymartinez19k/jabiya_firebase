import { Component, Input, OnInit } from '@angular/core';
import { OrderLine } from 'src/app/interfaces/order-line.interface';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-cart-product-image',
  templateUrl: './cart-product-image.component.html',
  styleUrls: ['./cart-product-image.component.scss'],
})
export class CartProductImageComponent implements OnInit {
  @Input() product: OrderLine;
  @Input() productIndex: number;
  userData;

  constructor(private _shoppingCartService: ShoppingCartService) { }

  async ngOnInit() { 
    // const { value } = await Storage.get({ key: 'userData' });
     localStorage.getItem('userData')
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  reduceProductQuantity() {
    if (this.product.quantity - 1 == 0 || this.product.quantity == this.product.minimum_order_qty) {
      this.removeProduct()
    }else{

      if(this.product.quantity == this.product.minimum_order_qty){
        this.product.quantity = 0
      }else{
        this.product.quantity = this.product.quantity - 1
      }
    }

    let cart = JSON.parse(localStorage.getItem(`shoppingCart${this.userData.company_code}`))

    let index = cart.findIndex(x => x.productId == this.product.productId)
    if(index > -1){
      cart[index] = this.product
      localStorage.setItem(`shoppingCart${this.userData.company_code}`, JSON.stringify(cart))
    }

  }
  addProductQuantity(){
    if(this.product.quantity == this.product.free_qty) return ;

    if(this.product.quantity == 0 && this.product.minimum_order_qty > 0){
      this.product.quantity = this.product.minimum_order_qty
    }else{
      this.product.quantity = this.product.quantity + 1
    }


    let cart = JSON.parse(localStorage.getItem(`shoppingCart${this.userData.company_code}`))

    let index = cart.findIndex(x => x.productId == this.product.productId)
    if(index > -1){
      cart[index] = this.product
      localStorage.setItem(`shoppingCart${this.userData.company_code}`, JSON.stringify(cart))
    }
  }
  round(value){
    if (!value || typeof(value) != 'number') return value;
    if (value == NaN ) return 0;

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
    
    return formatter.format(value).replace('DOP', 'RD$');;
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

  removeProduct() {
    this._shoppingCartService.orderLines.splice(this.productIndex, 1)
    localStorage.setItem(`shoppingCart${this.userData.company_code}`, JSON.stringify(this._shoppingCartService.orderLines))
  }
}
