// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface UserProfile {
  username: string;
  email: string;
  contactNo: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserProfile | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((res) => {
        const user: UserProfile = {
          username: res.username,
          email: res.email,
          contactNo: res.contactNo,
          role: res.role
        };
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  signup(data: any) {
    return this.http.post('/api/auth/signup', data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }
}

interface AuthResponse {
  token: string;
  username: string;
  email: string;
  contactNo: string;
  role: string;
}