import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';
  
  products = signal<Product[]>([]);
  searchTerm = signal<string>('');

  // Computed signal that automatically filters products whenever products or searchTerm changes
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();
    
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      (product.category && product.category.toLowerCase().includes(term))
    );
  });

  constructor(private http: HttpClient) {}

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductImageUrl(product: Product): string {
    if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('data:'))) {
      return product.image;
    }
    if (product.id) {
      return `/api/products/${product.id}/image`;
    }
    return 'https://via.placeholder.com/300?text=No+Image';
  }
}
