import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ✅ fixed path

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  
  loginData = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  loginUser() {
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveRole(response.role);
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Invalid credentials!');
      }
    });
  }
}
