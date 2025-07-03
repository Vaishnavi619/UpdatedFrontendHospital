import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // 👈 Correct path from component
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'RECEPTIONIST';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
     localStorage.removeItem('token');
  localStorage.removeItem('role'); // Optional: also clear role
    const user = {
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.authService.register(user).subscribe({
      next: () => {
        alert('User registered successfully! Now you can log in.');
        this.router.navigate(['/login']); // ✅ Redirect after registration
      },
      error: (err) => {
        console.error('Registration Failed:', err);
        alert('Something went wrong during registration.');
      }
    });
  }
}
