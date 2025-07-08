import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login
  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  // ✅ Register
  register(user: any) {
    return this.http.post('http://localhost:8080/api/users', user);
  }

  // ✅ Save token
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // ✅ Save role
  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  // ✅ Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Get role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // ✅ Clear all auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ✅ Logout
  logout(): void {
    this.clearAuthData();              // clears token and role
    this.router.navigate(['/signin']); // navigate to sign-in page
  }
}
