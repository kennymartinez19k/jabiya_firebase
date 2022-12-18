import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';
import { NavigationExtras, Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-points',
  templateUrl: './points.page.html',
  styleUrls: ['./points.page.scss'],
})
export class PointsPage implements OnInit {

  public languageJson = {
    pointsPage: {
      spanish: {

        titlemsg: 'JABIYA PESOS PARA CANJEAR',
        subtitle: 'Jabiya Pesos disponibles',
        pointsDescription: 'Nota: Este total incluye ordenes no facturadas y podria cambiar luego de que las ordenes serian facturadas.',
        pointsHistorybutton: 'Historial de Jabiya Pesos',
        bactToHomeButton: 'Continuar Comprando',
        addbutton: 'Añadir',
        orderNumber: 'Número de orden',
        date: 'Fecha',
        noOfPoints: 'No. de Jabiya Pesos',
        totalPoints: 'Balance de Jabiya Pesos al día de hoy'
      },
      english: {
        titlemsg: 'Jabiya Coins TO EXCHANGE',
        subtitle: 'Available Jabiya Coins',
        pointsDescription: 'Note: This total includes unbilled orders and may change after orders are billed.',
        pointsHistorybutton: 'History Jabiya Coins',
        bactToHomeButton: 'Continue Shopping',
        addbutton: 'Add',
        orderNumber: 'Order Number',
        date: 'Date',
        noOfPoints: 'No. of Jabiya Coins',
        totalPoints: 'Jabiya Coins Balance as of today'

      }
    }
  };
  public language: any;
  public pointsCount: any;
  public banners = [];
  public loading = false;
  public allProducts = []
  searchValue = null
  resultSearchProduct = []
  resultSearchResetProducts = []
  pointsHistoryData = []
  public userData: any
  partnerPoints = []
  public slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
  };
  constructor(public _shoppingCartService: ShoppingCartService, private landingPageService: LandingPageService, public sanitizer: DomSanitizer, private router: Router) {
    this.language = localStorage.getItem(LANGUAGE);

    // Storage.get({ key: 'userData' }).then((result) => {
      
      const userData = JSON.parse(localStorage.getItem('userData'))
      this.pointsCount = userData.loyaltyPoints;
  }

  ngOnInit() {
    this.getUserData()
    this.getProducts()
    this.getPointsHistory();
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
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

  getProducts() {
    this.landingPageService.getProducts().subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.allProducts = res.result.data.products
          for (let i = 0; i < this.allProducts.length; i++) {
            const product = this.allProducts[i];
            product.priceForShow = product.price.toFixed(2)
          }
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    );
  }

  filterProduct(e) {
    if (e.target.value !== '') {
      this.searchValue = e.target.value
      this.resultSearchProduct = this.allProducts.filter(product => product.name.toLowerCase().includes(this.searchValue.toLowerCase()))
      this.resultSearchResetProducts = JSON.parse(JSON.stringify(this.resultSearchProduct));
    } else {
      this.searchValue = null
    }
  }



  ionViewWillEnter() {
    this.getAllBanners();
  }


  getAllBanners(): void {
    this.loading = true;
    this.landingPageService.getBanners('points/').subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.banners = response.result.data.sort((a, b) => a.sequence - b.sequence);
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }

  goToProductDetails(id) {
    if (id && id !== '0' && id !== 0) {
      this.loading = true;
      this.landingPageService.getProductDetails(id).subscribe(
        (response) => {
          if (response) {
            let product = response.result.data.products.find(x => x)
            const navigationExtras: NavigationExtras = {
              state: {
                productDetails: product,
              },
            };
            this.router.navigate(['../product-details'], navigationExtras);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log('error', error);
        }
      );
    }
  }
}
