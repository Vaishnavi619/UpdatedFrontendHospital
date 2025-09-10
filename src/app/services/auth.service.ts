import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8081/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login (Step 1: Sends OTP)
  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  
  // ✅ Register user
  register(user: any) {
    return this.http.post('http://localhost:8081/api/users', user);
  }

  // ✅ Save token in local storage
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

  // ✅ Clear token and role
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ✅ Logout
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/signin']); // or use '/login' if that's your login route
  }

  // ✅ Decode username from JWT token
  getLoggedInUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // 'sub' contains the username
  }
  // ✅ Add this method in AuthService
sendOtp(email: string) {
  return this.http.post(`${this.BASE_URL}/login`, { email });
}

verifyOtp(data: { email: string; otp: string }) {
  return this.http.post(`${this.BASE_URL}/verify-otp`, data);
}


}
