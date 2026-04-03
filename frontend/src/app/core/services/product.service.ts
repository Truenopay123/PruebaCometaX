import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  is_active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(activeOnly = false): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products?active_only=${activeOnly}`);
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  create(data: Product): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.api}/products/${id}`, data);
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${this.api}/products/${id}/deactivate`, {});
  }

  activate(id: string): Observable<any> {
    return this.http.patch(`${this.api}/products/${id}/activate`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/products/${id}`);
  }
}
