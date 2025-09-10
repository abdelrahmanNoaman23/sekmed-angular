import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './features/products/products';  
import { ProductDetail } from './features/products/product-detail/product-detail';

export const routes: Routes = [
  { path: 'products', component: Products },
  { path: 'product/:id', component: ProductDetail },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}