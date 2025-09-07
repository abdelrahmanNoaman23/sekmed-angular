import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing-page/landing-page.component').then((c) => c.LandingPageComponent)
},
{
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.component').then((c) => c.HomePageComponent)
}
];
