import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.css']
})
export class RegisterDoctorComponent implements OnInit {
  doctorForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      doctorName: ['', Validators.required],
      specialization: ['', Validators.required],
       experience: ['', [Validators.required, Validators.min(0)]],
      timings: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const doctorData = this.doctorForm.value;

    this.http.post('http://localhost:8080/api/doctors', doctorData).subscribe({
      next: () => {
        alert('Doctor registered successfully');
        this.router.navigate(['/admin/view-doctors']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Failed to register doctor');
      }
    });
  }
  preventNegative(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e'||event.key === '0') {
    event.preventDefault();
  }
}
allowOnlyDigits(event: KeyboardEvent): void {
  const char = event.key;
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault(); // Block non-digit characters
  }
}


}
