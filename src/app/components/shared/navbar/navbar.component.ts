import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  
  isAuthPage(): boolean {
    const path = this.router.url;
    return path === '/' || path.includes('login') || path.includes('register');
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['']); 
}
}