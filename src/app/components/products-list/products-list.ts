import { Component, Input, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService } from '../../services/cart.service';
import { Product } from '../../services/data.service';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {
  @Input() products: Product[] = [];

  constructor(private cartService: CartService) {}

  trackByProductId: TrackByFunction<Product> = (index: number, product: Product) => product.id;

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
