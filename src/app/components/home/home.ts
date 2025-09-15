import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CategorySidebarComponent } from '../category-sidebar/category-sidebar';

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
}

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
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  isLoading = true;
  private countdownInterval: any;
  Math = Math;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private zone: NgZone) {
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
          console.log('Raw categories response:', data.categories);
          this.categories = data.categories.map(category => ({
            id: category.id,
            name: category.name,
            image: category.image || 'https://via.placeholder.com/150'
          }));
          this.products = data.products.map(product => ({
            ...product,
            images: Array.isArray(product.images) ? product.images : [product.images || 'https://via.placeholder.com/150']
          }));
          this.sideMenuCategories = this.categories && this.categories.length > 0 ? this.categories.slice(0, 6) : [];
          this.displayProducts = this.products && this.products.length > 0 ? this.products.slice(0, 10) : [];
          this.isLoading = false;
          console.log('SideMenuCategories before detectChanges:', this.sideMenuCategories);
          this.cdr.detectChanges();
          console.log('Change detection triggered');
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.sideMenuCategories = [];
          this.displayProducts = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('SideMenuCategories:', this.sideMenuCategories);
          console.log('DisplayProducts:', this.displayProducts);
        }
      });
    });
  }

  onCategorySelected(categoryId: number) {
    console.log('Navigating to products with category:', categoryId);
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

startCountdown() {
  this.countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = this.flashSaleEndTime.getTime() - now;
    this.countdown = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
    this.cdr.detectChanges();
  }, 1000);
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

  getDiscountPercentage(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  getOriginalPrice(currentPrice: number): number {
    const discount = this.getDiscountPercentage();
    return Math.round(currentPrice / (1 - discount / 100));
  }
}