import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent {
  @Input() products: Product[] = [];

  constructor(private cartService: CartService) {}

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('Product added to cart:', product.title);
  }
}