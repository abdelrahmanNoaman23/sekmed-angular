import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.html" ,
  styleUrls: ['./navbar.css']
})
export class NavigationComponent implements OnInit {
  activeRoute: string = '';
  isUserDropdownOpen: boolean = false;

  navigationItems = [
    { label: 'Home', route: '/home', icon: 'home' },
    { label: 'Products', route: '/products', icon: 'shopping-bag' },
    { label: 'User', route: '/user', icon: 'user', hasDropdown: true },
    { label: 'Cart', route: '/cart', icon: 'shopping-cart' }
  ];

  userDropdownItems = [
    { label: 'Profile', route: '/user/profile' },
    { label: 'Settings', route: '/user/settings' },
    { label: 'Orders', route: '/user/orders' },
    { label: 'Logout', route: '/logout' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial active route
    this.activeRoute = this.router.url;
    
    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        this.isUserDropdownOpen = false; // Close dropdown on route change
      }
    });
  }
  getIcon(iconName: string): string {
  const icons: { [key: string]: string } = {
    'home': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
    'shopping-bag': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path></svg>',
    'user': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
    'shopping-cart': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path></svg>'
  };
  return icons[iconName] || '';
}

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeDropdown() {
    this.isUserDropdownOpen = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeDropdown();
  }
}