import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-details-product',
  templateUrl: './details-product-component.html',
  styleUrls: ['./details-product-component.scss'],
})
export class DetailsProduct implements OnInit {
  public languageJson = {
    detailsProduct: {
      spanish: {

      },
      english: {}
    },
  };
  userData: any;
  modeEnv = ''
  version = null

  constructor(public shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')
    this.userData = JSON.parse(localStorage.getItem('userData'))
  }
}
