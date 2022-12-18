import { Component, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@capacitor/storage';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';
import { LANGUAGE } from 'src/app/util/constants';



@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  
  @ViewChild('mySearchbar') mySearchbar: ElementRef<HTMLInputElement>;

  public languageJson = {
    productsPage: {
      spanish: {
        addbutton: 'Añadir',
        search: 'Buscar'
      },
      english: {
        addbutton: 'Add',
        search: 'Search'
      }
    }
  };
  subCategories: any;
  products: any;
  public categoriName: any;
  public allProducts = []
  public userData: any
  public language: any;

  modeEnv = ''
  version = null
  searchValue = null
  loading = false
  resultSearchProduct = []
  resultSearchResetProducts = []
  resetProducts = []
  points = false
  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer, private router: Router, public _shoppingCartService: ShoppingCartService,     private landingPageService: LandingPageService,
    ) { }

  ngOnInit() {
    this.language = localStorage.getItem(LANGUAGE);
    this.getUserData()
    let products = JSON.parse(localStorage.getItem('products'))
    this.allProducts = products
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let data = this.router.getCurrentNavigation().extras.state?.data
        if(data){
          this.subCategories = this.router.getCurrentNavigation().extras.state?.data?.result?.data?.categories;
        }else{
          this.points = true
          this.subCategories = []
        }
        this.products = this.router.getCurrentNavigation().extras.state.products.result.data;
        for (let i = 0; i < this.products.length; i++) {
          const product = this.products[i];
          product.priceForShow = product.price.toFixed(2)
        }
        this.categoriName = this.router.getCurrentNavigation().extras.state.categoriName;
      }
    });
  }

  ngAfterViewInit(): void {
    // We can access the TestComponent now that this portion of the view tree has been initiated.
  let divvEl: HTMLDivElement = this.mySearchbar.nativeElement;
}

onCancel(e){
  this.searchValue = false
}
  
  
  async getUserData() {
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')

    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  filterProduct(e) {
    if (e?.target?.value !== '') {
      this.searchValue = e?.target?.value
      this.resultSearchProduct = this.allProducts.filter(product => product?.name?.toLowerCase()?.includes(this.searchValue?.toLowerCase()))
      this.resultSearchResetProducts = JSON.parse(JSON.stringify(this.resultSearchProduct));
    } else {
      this.searchValue = null
    }
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

}
