import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    this.checkSessionValidity();
  }

  private hasValidSession(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    if (!token || !userData) return false;

    const user = JSON.parse(userData);
    const sessionStart = user.sessionStart;
    return Date.now() - sessionStart < this.SESSION_DURATION;
  }

  private checkSessionValidity(): void {
    if (!this.hasValidSession()) {
      this.logout();
    }
  }

  register(userData: { name: string; email: string; password: string }): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((user: any) => user.email === userData.email)) {
      return false;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const token = Math.random().toString(36).substring(2);
      const userData = {
        ...user,
        sessionStart: Date.now()
      };

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }
}
