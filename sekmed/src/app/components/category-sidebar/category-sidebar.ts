import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-sidebar.html',
  styleUrls: ['./category-sidebar.css']
})
export class CategorySidebarComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() isLoading: boolean = false;
  @Output() categorySelected = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] || changes['isLoading']) {
      console.log('Categories:', this.categories, 'IsLoading:', this.isLoading);
      this.cdr.detectChanges();
    }
  }

  onCategoryClick(categoryId: number) {
    console.log('Category clicked:', categoryId);
    this.categorySelected.emit(categoryId);
  }
}