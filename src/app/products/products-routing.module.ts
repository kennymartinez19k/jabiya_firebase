import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './product-list/product-list.component';

import { ProductsPage } from './products.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: ProductsPage
//   }
// ];
export const routes: Routes = [
  {
    path: 'products',
    component: ProductsPage
  },
  { path: 'productCategory', component: ProductCategoryComponent },
  { path: 'productList', component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
