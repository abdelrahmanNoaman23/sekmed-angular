import { Component, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  cartItems$ = new BehaviorSubject<Product[]>([]);

  constructor(private cartService: CartService) {
    this.cartItems$.next(this.cartService.getCartItems());
  }

  trackByProductId: TrackByFunction<Product> = (index: number, product: Product) => product.id;

  removeFromCart(product: Product) {
    const items = this.cartService.getCartItems().filter(item => item.id !== product.id);
    localStorage.setItem('cart_items', JSON.stringify(items));
    this.cartItems$.next(items);
  }
}

