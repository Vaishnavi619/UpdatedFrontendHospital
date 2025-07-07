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

   logout(): void {
    localStorage.removeItem('token');    
    localStorage.removeItem('role');      
    this.router.navigate(['/signin']);    
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  register(user: any) {
    return this.http.post('http://localhost:8080/api/users', user);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
