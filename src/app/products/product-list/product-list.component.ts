import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationStart, NavigationExtras, NavigationEnd } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { LANGUAGE } from 'src/app/util/constants';
import { Storage } from '@capacitor/storage';
import { LandingPageService } from '../../services/landingPageServices/landing-page.service';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild('mySearchbar') mySearchbar: ElementRef<HTMLInputElement>;

  @Input() subCategories: any;
  public showHead = false;
  @Input() products: any;
  @Input() points: any;

  public productTitle: any;
  public productOwn: any;
  public data: any;
  public categoryLength: any;
  public productLength: any;
  public categoryName: any;
  public loading = false;
  private resetProducts: any;
  public showTitle = false;
  public productName: any;
  modeEnv = ''
  version = null
  public language: any;
  public categoriName: any;
  public intervalId: any;
  public userData: any
  public allProducts = []
  searchValue = null
  resultSearchProduct = []
  resultSearchResetProducts = []
    previousUrl: string = null;
  currentUrl: string = null;
  public languageJson = {
    listPage: {
      spanish: {
        welcomemsg: 'Presidente Regular',
        add: 'Añadir',
        nope: 'Actualmente esta categoría no posee productos',
        search: 'Buscar',
      },
      english: {
        welcomemsg: 'Regular President',
        add: 'Add',
        nope: 'Currently this category has no products',
        search: 'Search',
      }
    }
  }

  constructor(public sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, public _shoppingCartService: ShoppingCartService,
    private landingPageService: LandingPageService,
    ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/products/productList') {
          this.showHead = true;
          this.showTitle = true;
        } else {
          this.showHead = false;
          this.showTitle = false;
        }
      }
    });
  }

  ngOnInit() {
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
     this.previousUrl = this.currentUrl;
     this.currentUrl = event.url;
     if(this.previousUrl != '/product-details'){
      this.getUserData()
      let products = JSON.parse(localStorage.getItem('products'))
      this.allProducts = products
      this.language = localStorage.getItem(LANGUAGE);
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras?.state?.products) {
          this.products = this.router.getCurrentNavigation().extras.state.products.result.data;
          for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];
            product.priceForShow = product.price.toFixed(2)
          }
          this.resetProducts = JSON.parse(JSON.stringify(this.products));
          // this.productName=this.resetProducts[0].name        
          this.productLength = this.products.length;
          this.categoriName = this.router.getCurrentNavigation().extras.state.categoriName;
          this.productName = this.categoriName;
          this.data = this.router.getCurrentNavigation().extras.state.data;
          this.productOwn = this.data;
          this.productTitle = (this.productName !== '' ? this.productName : this.productOwn);
          this.productTitle = this.productName === undefined ? this.productOwn : this.productName;
          this.categoryName = this.router.getCurrentNavigation().extras?.state?.data?.result?.data?.categories;
          this.categoryLength = this.categoryName?.length;
          this.intervalId = setInterval(() => {
            if (this.productLength !== 0 && this.categoryLength !== 0) {
              this.showTitle = false;
            }
            else {
              this.showTitle = true;
            }
          }, 200);
        }
      });

     }else{
      this.loading = false
     }
  });
    
   
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
   
    this.userData = JSON.parse( localStorage.getItem('userData'));
  }
  filterProduct(e) {
    if (e?.target?.value !== '') {
      this.searchValue = e?.target?.value
      this.resultSearchProduct = this.allProducts?.filter(product => product?.name?.toLowerCase()?.includes(this.searchValue?.toLowerCase()))
      this.resultSearchResetProducts = JSON.parse(JSON.stringify(this.resultSearchProduct));
    } else {
      this.searchValue = null
    }
  }
  ngAfterViewInit(): void {
    // We can access the TestComponent now that this portion of the view tree has been initiated.
  let divvEl: HTMLDivElement = this.mySearchbar?.nativeElement;
}

onCancel(e){
  this.searchValue = false
}
  
  
  goToProductDetails(id): void {
    
    this.loading = true;
    this.landingPageService.getProductDetails(id).subscribe(
      (response) => {
        let product = response.result.data.products.find(x => x)
        if (response) {
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

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.productTitle = null;
    this.productOwn = null;
    this.data = null;
    this.categoryLength = null;
    this.productLength = null;
    this.categoryName = null;
    this.loading = null;
    this.resetProducts = null;
    this.showTitle = null;
    this.productName = null;
    this.language = null;
    this.categoriName = null;
  }
}
