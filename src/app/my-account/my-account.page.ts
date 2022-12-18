import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { LANGUAGE } from '../util/constants';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { AuthService } from '../services/authServices/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-accounte',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  segment: string;
  public language: any;
  sessionExpired = false
  public languageJson = {
    accountPage: {
      spanish: {
        acc: 'Mi Cuenta',
        request: 'pedidos',
        bill: 'cuenta',
        invoice: 'facturas',
        credit: 'CRÉDITO ',
      },
      english: {
        acc: 'My accounts',
        request: 'Request',
        bill: 'bill',
        invoice: 'invoice',
        credit: 'Credits',
      }
    }
  }
  constructor(
    public _shoppingCartService: ShoppingCartService,
    public landingPageService: LandingPageService,
    public authService: AuthService,
    private router: Router,

    ) {
    this.segment = 'pedidos';
    this.language = localStorage.getItem(LANGUAGE);
  }
  segmentChanged(ev: any) {
    this.segment = ev.target.value;
  }
  ngOnInit() {
  }
  
 
  
  logOut(e = true){
    this.sessionExpired = false

    this.authService.logOut().subscribe(
      (response) => {
        localStorage.removeItem('userData')
        this.router.navigate(['./']);
      },
      (error: any) => {
        localStorage.removeItem('userData')
        this.router.navigate(['./']);
      }
      );
  }
      

  ionViewDidEnter() {
    this.segment = 'pedidos';
  }
}
