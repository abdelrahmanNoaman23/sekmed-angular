import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CartService } from '../app/services/cart.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cartService: CartService, private router: Router) {}

  canActivate(): boolean {
    const items = this.cartService.getCartItems();
    if (items.length === 0) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
