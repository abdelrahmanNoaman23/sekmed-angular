// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';

export interface User {
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.post<{ isAvailable: boolean }>(`${this.apiUrl}/check-email`, { email }).pipe(
      map(response => response.isAvailable),
      take(1)
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }),
      take(1)
    );
  }

  signup(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { email, password }).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }),
      take(1)
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return this.userSubject.value?.token || null;
  }
}