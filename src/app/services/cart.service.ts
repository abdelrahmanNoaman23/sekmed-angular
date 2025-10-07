import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.cartItemsSubject.next(this.getCartItems());
  }

  getCartItems(): Product[] {
    const items = localStorage.getItem(this.cartKey);
    return items ? JSON.parse(items) : [];
  }

  getCartItemsObservable() {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: Product) {
    const items = this.getCartItems();
    items.push(product);
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }
}
