import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductsPageComponent } from './components/products-page/products-page';
import { CartComponent } from './components/cart/cart';
import { SignupComponent } from './components/signup/signup';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'user/profile', component: HomeComponent }, // Placeholder for user profile component
  { path: '**', redirectTo: 'home' }
];