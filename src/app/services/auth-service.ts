import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.authState.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getMe(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error('Token não encontrado'));

    return this.http.get(`${this.apiUrl}/me`);
  }
}
