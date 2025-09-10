import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchProducts(searchTerm?: string): void {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.append('title', searchTerm);
    }
    this.http.get<any[]>(this.apiUrl, { params }).subscribe(res => {
      this.productsSubject.next(res); // Update the BehaviorSubject with new data
    });
  }

  fetchProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}