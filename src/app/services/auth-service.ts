import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private authState = new BehaviorSubject<boolean>(this.hasToken());
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());

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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authState.next(false);
    this.userSubject.next(null);
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

  private getStoredUser(): any {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  userChanges(): Observable<any> {
    return this.userSubject.asObservable();
  }
}
