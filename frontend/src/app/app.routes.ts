/*import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductListComponent) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./components/product-detail/product-detail').then(m => m.ProductDetailComponent) 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/product-admin/product-admin').then(m => m.ProductAdminComponent),title: 'Admin Dashboard' 
  },
  { path: '**', redirectTo: '' }
];*/

import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ProductAdminComponent } from './components/product-admin/product-admin';
import { LoginComponent } from './components/login/login';
import { Signup } from './components/signup/signup'; // Ensure path matches your signup component location
import { adminGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: Signup },
  { path: 'admin', component: ProductAdminComponent, canActivate: [adminGuard] }
];