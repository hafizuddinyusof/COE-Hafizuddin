import { Component, inject, signal, computed, OnInit, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-admin.html',
  styleUrl: './product-admin.css'
})
export class ProductAdminComponent implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  public productService = inject(ProductService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  products = signal<Product[]>([]);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  
  categories = ['Electronics', 'Apparel', 'Accessories', 'Home'];

  // Form State
  currentProduct: Product = this.getEmptyProduct();
  selectedFile: File | null = null;

  // Pagination State (7 items per page)
  currentPage = signal<number>(1);
  pageSize = 7;

  // Compute total pages
  totalPages = computed(() => {
    return Math.ceil(this.products().length / this.pageSize) || 1;
  });

  // Slice 7 items for current page
  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products().slice(start, end);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<Product[]>('/api/products').subscribe({
        next: (data) => this.products.set(data),
        error: (err) => console.error('Failed to load products:', err)
      });
    }
  }

  getEmptyProduct(): Product {
    return { id: 0, name: '', category: 'Electronics', price: 0, rating: 5.0, stock: 0, image: '' };
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Combined single multipart request for saving/uploading products
  saveProduct(): void {
    if (!this.currentProduct.name) {
      alert('Please enter a product name.');
      return;
    }

    this.isSaving.set(true);

    const formData = new FormData();
    formData.append('name', this.currentProduct.name);
    formData.append('category', this.currentProduct.category);
    formData.append('price', (this.currentProduct.price ?? 0).toString());
    formData.append('rating', (this.currentProduct.rating ?? 0).toString());
    formData.append('stock', (this.currentProduct.stock ?? 0).toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing()) {
      this.http.put<Product>(`/api/products/${this.currentProduct.id}`, formData)
        .subscribe({
          next: () => {
            alert('Product updated successfully!');
            this.isSaving.set(false);
            this.loadProducts();
            this.resetForm();
          },
          error: (err) => {
            this.isSaving.set(false);
            console.error('Failed to update product:', err);
            alert('Failed to update product: ' + (err.error?.message || err.statusText || 'Server Error'));
          }
        });
    } else {
      this.http.post<Product>('/api/products', formData)
        .subscribe({
          next: () => {
            alert('Product uploaded successfully!');
            this.isSaving.set(false);
            this.loadProducts();
            this.resetForm();
          },
          error: (err) => {
            this.isSaving.set(false);
            console.error('Failed to upload product:', err);
            alert('Failed to upload product: ' + (err.error?.message || err.statusText || 'Server Error'));
          }
        });
    }
  }

  // Quick Stock Actions directly from the Admin Table
  adjustStock(product: Product, delta: number): void {
    const currentStock = product.stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    const updatedProduct = { ...product, stock: newStock };
    this.http.put<Product>(`/api/products/${product.id}`, updatedProduct)
      .subscribe({
        next: () => {
          this.products.update(prods => prods.map(p => p.id === product.id ? updatedProduct : p));
        },
        error: (err) => console.error('Failed to update stock:', err)
      });
  }
  
  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditing.set(true);
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteProduct(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => {
          console.error('Failed to delete product:', err);
          alert('Failed to delete product: ' + (err.error?.message || err.statusText || 'Server Error'));
        }
      });
    }
  }

  resetForm(): void {
    this.currentProduct = this.getEmptyProduct();
    this.selectedFile = null;
    this.isEditing.set(false);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Pagination Control Methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
