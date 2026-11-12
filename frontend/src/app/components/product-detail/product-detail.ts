import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public productService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductById(+id);
    } else {
      this.errorMessage.set('Invalid product ID');
      this.isLoading.set(false);
    }
  }

  fetchProductById(id: number): void {
    this.http.get<Product>(`/api/products/${id}`).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.errorMessage.set('Product not found or network error.');
        this.isLoading.set(false);
      }
    });
  }
}
