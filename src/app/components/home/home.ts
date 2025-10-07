// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CategorySidebarComponent } from '../category-sidebar/category-sidebar';
import { DataService, Category, Product } from '../../services/data.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, CategorySidebarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  sideMenuCategories: Category[] = [];
  displayProducts: Product[] = [];
  currentSlide = 0;
  flashSaleEndTime = new Date();
  countdown: { days: number; hours: number; minutes: number; seconds: number } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  isLoading = true;
  private countdownInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private dataService: DataService,
    private cartService: CartService
  ) {
    this.flashSaleEndTime.setDate(this.flashSaleEndTime.getDate() + 3);
  }

  ngOnInit() {
    this.loadData();
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  loadData() {
    this.isLoading = true;
    const categories$ = this.http.get<Category[]>('https://api.escuelajs.co/api/v1/categories');
    const products$ = this.http.get<Product[]>('https://api.escuelajs.co/api/v1/products');

    this.zone.run(() => {
      forkJoin({
        categories: categories$,
        products: products$
      }).subscribe({
        next: (data) => {
          this.categories = data.categories.map(category => ({
            id: category.id,
            name: category.name,
            image: category.image || 'https://via.placeholder.com/150'
          }));
          this.products = data.products.map(product => ({
            ...product,
            images: Array.isArray(product.images) ? product.images : [product.images || 'https://via.placeholder.com/150'],
            reviewCount: Math.floor(Math.random() * 100) + 1,
            discountPercentage: Math.floor(Math.random() * 50) + 10
          }));
          this.sideMenuCategories = this.categories.slice(0, 6);
          this.displayProducts = this.products.slice(0, 10);
          this.dataService.setCategories(this.categories);
          this.dataService.setProducts(this.products);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.sideMenuCategories = [];
          this.displayProducts = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  onCategorySelected(categoryId: number) {
    this.dataService.setSelectedCategoryId(categoryId);
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  startCountdown() {
    this.zone.runOutsideAngular(() => {
      this.countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = this.flashSaleEndTime.getTime() - now;
        this.zone.run(() => {
          this.countdown = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          };
          this.cdr.markForCheck();
        });
      }, 1000);
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % Math.ceil(this.categories.length / 6);
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? Math.ceil(this.categories.length / 6) - 1 : this.currentSlide - 1;
  }

  getVisibleCategories() {
    const startIndex = this.currentSlide * 6;
    return this.categories.slice(startIndex, startIndex + 6);
  }

  getOriginalPrice(currentPrice: number, discountPercentage: number): number {
    return Math.round(currentPrice / (1 - discountPercentage / 100));
  }
}