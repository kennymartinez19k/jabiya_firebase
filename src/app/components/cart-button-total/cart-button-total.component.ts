import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd  } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cart-button-total',
  templateUrl: './cart-button-total.component.html',
  styleUrls: ['./cart-button-total.component.scss'],
})
export class CartButtonTotalComponent implements OnInit {
  @Input() router
  @Input() isCart
  public isShoppingCart: Boolean = false
  public isProductList: Boolean = false
  currentRoute: any
  constructor(
    private shoppingCartService: ShoppingCartService,
    private route: Router,

    ) { }

  ngOnInit() { 
    if(isNaN(this.getTotal())){
      this.route.navigate(['./']);
    }
    this.route.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event
        this.isShoppingCart = this.currentRoute?.url != '/shopping-cart' ;
        this.isProductList = this.currentRoute?.url == '/products/productList'
      });
  }

  getTotal() {
    return this.shoppingCartService.getResume().total
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


  formatterCurrency(value) {
    if (!value || isNaN(value)) return value;
    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
    return formatter.format(value).replace('DOP', 'RD$');;
  }
}
