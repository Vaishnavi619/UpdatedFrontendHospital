import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BackButtonComponent } from '../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule,BackButtonComponent],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  otp: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  verifyOtp() {
    const email = localStorage.getItem('otpEmail'); 

    if (!email) {
      alert('No email found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    const otpData = {
      email: email,
      otp: this.otp
    };

    this.authService.verifyOtp(otpData).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveRole(res.role);

        alert('✅ OTP Verified! Login successful');
        localStorage.removeItem('otpEmail'); 
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('❌ Invalid OTP. Please try again.');
      }
    });
  }
}
