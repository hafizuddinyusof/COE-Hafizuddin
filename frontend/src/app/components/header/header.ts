import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  constructor(public productService: ProductService) {}

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productService.setSearchTerm(input.value);
  }

  clearSearch(): void {
    this.productService.setSearchTerm('');
  }
  // Cart count state (we will connect this to CartService in the next step)
  cartCount = signal<number>(0);
}