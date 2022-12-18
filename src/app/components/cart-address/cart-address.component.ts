import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-cart-address',
  templateUrl: './cart-address.component.html',
  styleUrls: ['./cart-address.component.scss'],
})
export class CartAddressComponent implements OnInit {

  constructor() { }
  public address;
  public store;

  ngOnInit() {
    let result = JSON.parse(localStorage.getItem('userData'))
    let userData = result;
    this.address = userData["delivery_address"]?.full_address
    this.store = userData["company_name"]
  }
}
