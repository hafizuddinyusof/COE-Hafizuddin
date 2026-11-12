import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  categories: string[] = ['All', 'Electronics', 'Apparel', 'Accessories', 'Home'];
  selectedCategory = signal<string>('All');

  // Pagination State
  currentPage = signal<number>(1);
  pageSize = 8;

  // 1. Filter products by category and global search term
  filteredProducts = computed(() => {
    const products = this.productService.products();
    const search = this.productService.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return products.filter(product => {
      const matchesCategory = category === 'All' || product.category?.toLowerCase() === category.toLowerCase();
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search) || 
        (product.category && product.category.toLowerCase().includes(search));

      return matchesCategory && matchesSearch;
    });
  });

  // 2. Compute total pages dynamically
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize) || 1;
  });

  // 3. Slice 8 items for the active page view
  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts().slice(start, end);
  });

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1); // Reset back to page 1 on category change
  }

  // Pagination Helper Methods
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