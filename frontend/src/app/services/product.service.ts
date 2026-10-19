import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAll(search = '', category = ''): Observable<Product[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    return this.http.get<Product[]>(this.api, { params });
  }

  getOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(p: Product): Observable<Product> {
    return this.http.post<Product>(this.api, p);
  }

  update(id: number, p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, p);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
