import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LandingPageService } from '../../services/landingPageServices/landing-page.service';
import { LANGUAGE } from 'src/app/util/constants';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
  @Input() subCategories: any;
  public loading = false;
  public language:any;
  public subcategorytitle:any;
  public categoriName: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public sanitizer: DomSanitizer,
    private landingPageService: LandingPageService
  ) {
    this.language=localStorage.getItem(LANGUAGE);
  }
  gotoPdtList(id,name) {
    this.loading = true;
    this.landingPageService.getProductsByCategories(id).subscribe(
      (res) => {
        if (res) {
          this.loading = false;
          const navigationExtras: NavigationExtras = {
            state: {
              data:name,
              products: res,
            },
          };
          this.router.navigate(['products/productList'], navigationExtras);
        }
      },
      (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // this.subCategories = this.router.getCurrentNavigation().extras.state.data.result.data.categories;
        // this.products = this.router.getCurrentNavigation().extras.state.products.result.data;
        this.categoriName = this.router.getCurrentNavigation().extras.state.categoriName;
        this.subcategorytitle = this.categoriName;
      }
    });
    if(this.subCategories.length === 0){
      this.subcategorytitle = this.categoriName;
      // this.subcategorytitle = this.language ==='English' ? 'No subcategory': 'Sin subcategoría'
      }
      else{
        this.subcategorytitle = this.categoriName;
        // this.subcategorytitle = this.subCategories;
    }
  }
}
