import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductCard } from './product-card/product-card';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  imports: [ProductCard, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy {
  products: any[] = [];
  private searchSubject = new Subject<string>();
  private subscription: Subscription = new Subscription();

  constructor(private productService: ProductService) {
    console.log('Products component initialized');
  }

  ngOnInit() {
    this.subscription.add(
      this.productService.products$.subscribe(res => {
        console.log('Products updated', res);
        this.products = res;
      })
    );

    // Set up search with debounce
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(searchTerm => {
        this.productService.fetchProducts(searchTerm);
      })
    );

    // Initial fetch
    this.productService.fetchProducts();
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  addToCart() {
    console.log('Hi from products component');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); 
  }
}