import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService, Category } from '../../services/data.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.dataService.categories$.subscribe(categories => {
        this.categories = categories;
      })
    );

    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        const categoryId = params['category'] ? +params['category'] : null;
        this.selectedCategoryId = categoryId;
        this.dataService.setSelectedCategoryId(categoryId);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectCategory(categoryId: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
  }
}