import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: { id: number; name: string; image: string };
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.loadProductsByCategory(categoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadProductsByCategory(categoryId: string) {
    this.http.get<Product[]>(`https://api.escuelajs.co/api/v1/categories/${categoryId}/products`).subscribe({
      next: (products) => {
        this.products = products.map(product => ({
          ...product,
          images: Array.isArray(product.images) ? product.images : [product.images]
        }));
      },
      error: (error) => {
        console.error('Error loading products for category:', error);
      }
    });
  }

  loadAllProducts() {
    this.http.get<Product[]>('https://api.escuelajs.co/api/v1/products').subscribe({
      next: (products) => {
        this.products = products.map(product => ({
          ...product,
          images: Array.isArray(product.images) ? product.images : [product.images]
        }));
      },
      error: (error) => {
        console.error('Error loading all products:', error);
      }
    });
  }
}