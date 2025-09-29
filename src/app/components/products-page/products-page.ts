import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService, Product } from '../../services/data.service';
import { CategoriesComponent } from '../categories/categories';
import { ProductsListComponent } from '../products-list/products-list';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriesComponent, ProductsListComponent],
  templateUrl: './products-page.html',
  styleUrls: ['./products-page.css']
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategoryId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.dataService.products$.subscribe(products => {
        this.products = products;
        this.filterProducts();
      })
    );

    this.subscriptions.add(
      this.dataService.selectedCategoryId$.subscribe(categoryId => {
        this.selectedCategoryId = categoryId;
        this.filterProducts();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSearchChange() {
    this.filterProducts();
  }

  private filterProducts() {
    let filtered = this.products;

    if (this.selectedCategoryId !== null) {
      filtered = filtered.filter(product => product.category.id === this.selectedCategoryId);
    }

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }
}