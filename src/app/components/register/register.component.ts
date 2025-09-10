import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../shared/back-button/back-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,BackButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'RECEPTIONIST';
  email = ''; // ✅ New property

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    const user = {
      username: this.username,
      password: this.password,
      role: this.role,
      email: this.email // ✅ Send email to backend
    };

    this.authService.register(user).subscribe({
      next: () => {
        alert('User registered successfully! Now you can log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration Failed:', err);
        alert('Something went wrong during registration.');
      }
    });
  }
}
