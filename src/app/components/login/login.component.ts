import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  sendOtp() {
    this.authService.sendOtp(this.email).subscribe({
  next: () => {
    localStorage.setItem('otpEmail', this.email);  
    alert('OTP sent to your email. Please enter it to proceed.');
    this.router.navigate(['/verify-otp']);
  },
      error: (err: any) => {
        console.error('OTP Send Error:', err);
        alert('❌ Failed to send OTP. Check if email is registered.');
      }
    });
  }
}
