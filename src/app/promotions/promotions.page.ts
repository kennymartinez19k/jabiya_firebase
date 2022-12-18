import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

import { LANGUAGE } from 'src/app/util/constants';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';


@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss'],
})
export class PromotionsPage implements OnInit {
  public languageJson = {
    promoPage: {
      spanish: {
        addbutton: 'Añadir',
        promo: 'Ofertas',
        homeButton: 'Continuar Comprando',
        description: 'Ofertas: Existen 3 grandes ofertas para hacer tu compra más comoda y económica'
      },
      english: {
        addbutton: 'Add',
        promo: 'Promotions',
        homeButton: 'Continue Shopping',
        description: 'Promotions: There are 3 great promotions to make your purchase more comfortable and economical'
      }
    }
  };
  public language: any;
  public slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
  };
  public loading = false;
  public categories = [];
  public banners = [];
  public allProducts = []
  searchValue = null
  public userData: any

  resultSearchProduct = []
  resultSearchResetProducts = []

  constructor(private landingPageService: LandingPageService,
    public _shoppingCartService: ShoppingCartService,
    public sanitizer: DomSanitizer, private router: Router) {
    this.language = localStorage.getItem(LANGUAGE);
  }

  ngOnInit() {
    this.getCategories();
    this.getAllBanners();
    this.getUserData()
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }


  getProducts(categories) {
    for (let index = 0; index < 2; index++) {
      const category = categories[index];

      this.landingPageService.getProductsByCategories(category.id).subscribe(
        (res) => {
          this.allProducts = [...this.allProducts, ...res.result.data]
          for (let i = 0; i < this.allProducts.length; i++) {
            const product = this.allProducts[i];
            product.priceForShow = product.price.toFixed(2)
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
    }
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

  getAllBanners(): void {
    this.loading = true;
    this.landingPageService.getBanners('discounts/').subscribe(
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

  filterByCategories(id) {

  }

  getCategories(): void {
    this.loading = true;
    this.landingPageService.getProductCategories().subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.categories = response.result.data.categories;
          this.getProducts(this.categories)
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }


  gotoPdtCategory(id, name): void {
    this.loading = true;
    this.landingPageService.getSubProductCategories(id).subscribe(
      (response) => {
        if (response) {
          this.landingPageService.getProductsByCategories(id).subscribe(
            (res) => {
              this.loading = false;
              if (res) {
                const navigationExtras: NavigationExtras = {
                  state: {
                    data: response,
                    products: res,
                    categoriName: name,
                  },
                };
                this.router.navigate(['products/products'], navigationExtras);
              }
            },
            (error: any) => {
              this.loading = false;
              console.log('error', error);
            }
          );
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
