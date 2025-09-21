import { Injectable } from '@angular/core';
import { Product } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart_items';

  getCartItems(): Product[] {
    const items = localStorage.getItem(this.cartKey);
    return items ? JSON.parse(items) : [];
  }

  addToCart(product: Product) {
    const items = this.getCartItems();
    items.push(product);
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }
}

export type { Product };
