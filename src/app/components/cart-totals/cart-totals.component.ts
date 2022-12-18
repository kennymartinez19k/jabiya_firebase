import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';

@Component({
  selector: 'app-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.scss'],
})
export class CartTotalsComponent implements OnInit {

  constructor(public _shoppingCartService: ShoppingCartService) { }

  ngOnInit() { }

  getTotals() {
    return this._shoppingCartService.getResume()
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



}
