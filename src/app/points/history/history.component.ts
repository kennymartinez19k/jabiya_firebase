import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';

import { IonRouterOutlet } from '@ionic/angular';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { LandingPageService } from 'src/app/services/landingPageServices/landing-page.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public languageJson = {
    pointsHistoryPage: {
      spanish: {
        titlemsg: 'Tabla de historial de Jabiya Pesos',
        orderNumber: 'Número de orden',
        date: 'Fecha',
        noOfPoints: 'No. de Jabiya Pesos',
        totalPoints: 'Balance de Jabiya Pesos al día de hoy'
      },
      english: {
        titlemsg: 'Jabiya Coins History Table',
        orderNumber: 'Order Number',
        date: 'Date',
        noOfPoints: 'No. of Jabiya Coins',
        totalPoints: 'Jabiya Coin Balance as of today'
      }
    }
  };
  public language: any;
  public pointsHistoryData: any;
  public partnerPoints: any;
  userData = null
  constructor(private landingPageService: LandingPageService, public _shoppingCartService: ShoppingCartService, private routerOutlet: IonRouterOutlet) {
    this.language = localStorage.getItem(LANGUAGE);
  }

  ngOnInit() {
    this.getPointsHistory();
    this.userData = JSON.parse(localStorage.getItem('userData'))
  }

  goBack() {
    this.routerOutlet.pop();
  }

  getPointsHistory() {
    
    this.landingPageService.getPointsHistory(this.userData.sub_user_id).subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.pointsHistoryData = res.result.data.history;
          this.partnerPoints = res.result.data.partner_loyalty_points
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
}
