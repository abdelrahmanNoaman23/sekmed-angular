import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  reviewCount?: number;
  discountPercentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private selectedCategoryIdSubject = new BehaviorSubject<number | null>(null);

  categories$ = this.categoriesSubject.asObservable();
  products$ = this.productsSubject.asObservable();
  selectedCategoryId$ = this.selectedCategoryIdSubject.asObservable();

  setCategories(categories: Category[]) {
    this.categoriesSubject.next(categories);
  }

  setProducts(products: Product[]) {
    this.productsSubject.next(products);
  }

  setSelectedCategoryId(categoryId: number | null) {
    this.selectedCategoryIdSubject.next(categoryId);
  }
}