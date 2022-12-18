import { Component, OnInit, ViewChild, ElementRef, HostListener,Renderer2, SimpleChanges } from '@angular/core';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { NavigationExtras, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';
import { AuthService } from '../services/authServices/auth.service';
import { LANGUAGE } from 'src/app/util/constants';
import { IonSlides } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  widthSize = window.innerWidth;
  @ViewChild('slides', { static: false }) slides: IonSlides;
  @ViewChild('mySearchbar') mySearchbar: ElementRef<HTMLInputElement>;
  @ViewChild('item') item: ElementRef;
  @ViewChild('itemInfo') itemInfo: ElementRef;
  @ViewChild('itemInfoTitle') itemInfoTitle: ElementRef;
  @ViewChild('itemInfoBtn') itemInfoBtn: ElementRef;
  @ViewChild('itemInfoIcon') itemInfoIcon: ElementRef;


  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }

  public languageJson = {
    homePage: {
      spanish: {
        titlemsg: 'Orden rápida',
        subtitle: 'Sugerencias basadas en tu orden anterior',
        quickbutton: 'Añadir Todo',
        addbutton: 'Añadir',
        promo: 'Ofertas',
        categories: 'Categorías',
        catlist: 'Lista de las categorías de productos disponibles',
        promList: 'Lista de las ofertas disponibles',
        search: 'Buscar productos',
        nextSlide: 'Siguiente',
        prevSlide: 'Anterior',
        searchProduct: 'Buscar'
      },
      english: {
        titlemsg: 'Quick order',
        subtitle: 'Suggestions based on your previous order',
        quickbutton: 'Add all',
        addbutton: 'Add',
        promo: 'Promotions',
        categories: 'Categories',
        catlist: 'List of available product categories',
        promList: 'List of available promotions',
        search: 'Search for products',
        nextSlide: 'Next',
        prevSlide: 'Prev',
        searchProduct: 'Search'


      }
    }
  };
 
    slideOpts = {
      initialSlide: 0,
      slidesPerView: 1,
      loop: false,
      autoplay: {
        delay: 6000
       }
    };

  sliderContainerOpts = {
    slidesPerView: 'auto',
    zoom: false,
    grabCursor: true,
    loop: false,
    autoplay: false
  };
  public loading = false;
  public categories = [];
  public userData: any = null;
  public easyOrderProducts = [];
  modeEnv = ''
  resultSearchProduct = []
  allProducts = []
  public searchValue = null
  public banners = [];
  public language: any;
  // public disableCart = true;
  public disableEasyOrderButton = true;
  private resetProducts: any;
  public resultSearchResetProducts: any
  previousUrl: string = null;
  currentUrl: string = null;
  cartDetails = {
    amount_total_to_show: 0
  }
  version = null
  pointsCategories: []
  filterName: string
  clickSub: any;
  constructor(
    private landingPageService: LandingPageService,
    private router: Router,
    public sanitizer: DomSanitizer,
    public _shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private renderer: Renderer2,
   
  ) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      
      if(
        e.target !== this.itemInfoTitle?.nativeElement 
        && e.target !== this.item?.nativeElement
        && e.target !== this.itemInfo?.nativeElement
        && e.target !== this.itemInfoBtn?.nativeElement
        && e.target !== this.itemInfoIcon?.nativeElement
 
       ){
        this.filterName = ''
        this.searchValue = false;
      }
  });

  
    
    this.language = localStorage.getItem(LANGUAGE);
  }

  

  ngAfterViewInit(): void {
    // We can access the TestComponent now that this portion of the view tree has been initiated.
  let divvEl: HTMLDivElement = this.mySearchbar.nativeElement;
}
  ngOnInit() {
    this.getUserData();
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
     this.previousUrl = this.currentUrl;
     this.currentUrl = event.url;
     if(this.previousUrl != '/product-details' && window.location.pathname == '/home'){
        this.getCategories();
        this.getEasyOrderDetails();
        this.getAllBanners();
        this.getProductByField()
        this.getPointsCategories()
      }
  });
  }

  getAllAccountsUnderUser() {
    if (!this.userData) return;
    this.authService.getAllAccountsUnderUser(this.userData.id).subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.authService.updateAccountsUnderUser(
            res.result.data
          );
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    );
  }

  onCancel(e){
    this.searchValue = false
  }
  filterProduct(e) {
    if(e.target?.value.length == 1){
      this.getProductByField()
    }
    if (e.target?.value !== '') {
      this.searchValue = e.target?.value
      this.resultSearchProduct = this.allProducts?.filter(product => product?.name.toLowerCase().includes(this.searchValue?.toLowerCase()))
      this.resultSearchResetProducts = JSON.parse(JSON.stringify(this.resultSearchProduct));
    } else {
      this.searchValue = null
    }
  }


  getEasyOrderDetails() {

    this.landingPageService.getEasyOrder().subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.easyOrderProducts = res.result.data.products;
          this.disableEasyOrderButton = true;
          for (let i = 0; i < this.easyOrderProducts.length; i++) {
            const element = this.easyOrderProducts[i];
            element.priceToShow = element.price.toFixed(2)
            if (Number(element.quantity) > 0) {
              this.disableEasyOrderButton = false;
            }
          }

          this.resetProducts = JSON.parse(JSON.stringify(this.easyOrderProducts));
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    );
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getAllAccountsUnderUser();
  }


  getAllBanners() {
    this.loading = true;
    this.landingPageService.getBanners('main_page/').subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.banners = response.result.data.sort((a, b) => a.sequence - b.sequence);
        }
      },
      (error: any) => {
        this.loading = false;
        localStorage.removeItem('userData')
        Storage.clear().then()
        this.logOut()
      }
    );
  }

  logOut(e = true){
    this.authService.logOut().subscribe(
      (response) => {
        if(e && window.location.pathname != '/register'){
          // localStorage.removeItem('userData')
          // this.router.navigate(['./']);
        }
      },
      (error: any) => {
        console.log(error)
        if(window.location.pathname != '/register'){
          // localStorage.removeItem('userData')
          // this.router.navigate(['./']);

        }
      }
      );
      
      
     
  }

  

  getCategories() {
    this.loading = true;
    this.landingPageService.getProductCategories().subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.categories = response.result.data.categories;
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }

  getPointsCategories() {
    this.loading = true;
    this.landingPageService.getPointsCategory().subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.pointsCategories = response.result.data.categories;
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }

  getProductByField() {
    this.loading = true;
    this.landingPageService.getProductsForField().subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          this.allProducts = response.result.data
          localStorage.setItem('products', JSON.stringify(this.allProducts))
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error for field', error);
      }
    );
  }

  getSession() {
    this.loading = true;
    this.landingPageService.getSession().subscribe(
      (response) => {
        this.loading = false;
        
       

      },
      
      (error: any) => {
        this.loading = false;
        
        console.log('error', error.error);
        this.logOut()
      }
    );
  }

  gotoPdtCategory({id, name, children}) {
    this.loading = true;

    if(children.length == 0){
      this.landingPageService.getProductsByCategories(id).subscribe(
        (res) => {
          if (res) {
            const navigationExtras: NavigationExtras = {
              state: {
                data: null,
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
    }else{
      this.landingPageService.getSubProductCategories(id).subscribe(
        (response) => {
          if (response) {
            this.landingPageService.getProductsByCategories(id).subscribe(
              (res) => {
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
  }

  gotoPointsCategory(id, name) {
    this.loading = true;
    this.landingPageService.getProductsByPointsCategory(id).subscribe(
      (res) => {
        this.loading = false;
        if (res) {
          res.result.data = res.result.data.products
          const navigationExtras: NavigationExtras = {
            state: {
              data: null,
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

  goToProductDetails(id) {
    if (id && id !== '0' && id !== 0) {
      this.loading = true;
      this.landingPageService.getProductDetails(id).subscribe(
        (response) => {
          if (response) {
            let product = response.result.data.products.find(x => x)
            if(product){
              const navigationExtras: NavigationExtras = {
                state: {
                  productDetails: product,
                },
              };
              this.router.navigate(['../product-details'], navigationExtras);
            }
            this.loading = false;
          }
        },
        (error: any) => {
          this.loading = false;
          console.log('error', error);
        }
      );
    }
  }


  ngOnDestroy() {
    // this.language = null;
    // localStorage.removeItem('LANGUAGE'); //correct
    // localStorage.removeItem('$$language$$'); //correct
    // localStorage.removeItem(LANGUAGE);
    this.userData
  }
  
  public position = 10
  public heightScreen = window.innerHeight;

}
