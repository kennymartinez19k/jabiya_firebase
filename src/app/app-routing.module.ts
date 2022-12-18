import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsPageModule),
  },
  {
    path: 'shopping-cart',
    loadChildren: () =>
      import('./shopping-cart/shopping-cart.module').then(
        (m) => m.ShoppingCartPageModule
      ),
  },
  {
    path: 'my-account',
    loadChildren: () =>
      import('./my-account/my-account.module').then(
        (m) => m.MyAccountPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'points',
    loadChildren: () =>
      import('./points/points.module').then((m) => m.PointsPageModule),
  },
  {
    path: 'logs',
    loadChildren: () =>
      import('./Logs/logs.module').then((m) => m.LogsPageModule),
  },
  {
    path: 'product-details',
    loadChildren: () =>
      import('./product-details/product-details.module').then((m) => m.ProductDetailsPageModule),
  },
  {
    path: 'promotions',
    loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsPageModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
