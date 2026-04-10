import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
}

export interface ProductsResponse {
  results: Product[];
  total: number;
}

export interface StockResponse {
  id: number;
  name: string;
  inStock: boolean;
  stock: number;
}

export interface CartResponse {
  id: number;
  name: string;
  stock: number;
  inStock: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  search(query: string, category: string) {
    return this.http.get<ProductsResponse>(
      `${this.base}/products?search=${query}&category=${category}`
    );
  }

  checkStock(productId: number) {
    return this.http.get<StockResponse>(
      `${this.base}/products/${productId}/stock`
    );
  }

  addToCart(productId: number, quantity = 1) {
    return this.http.patch<CartResponse>(
      `${this.base}/products/${productId}/cart`,
      { quantity }
    );
  }
}
