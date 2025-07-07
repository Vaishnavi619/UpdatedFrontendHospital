import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
  imports:[ReactiveFormsModule]
})
export class CreatePrescriptionComponent implements OnInit {
  prescriptionForm!: FormGroup;
  appointmentId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

 ngOnInit(): void {
  this.prescriptionForm = this.fb.group({
    diagnosis: ['', Validators.required],
    advice: [''],
    date: ['', Validators.required]
  });

  // ✅ Read appointmentId from query parameters
  this.route.queryParams.subscribe(params => {
    this.appointmentId = +params['appointmentId'];
    console.log('Appointment ID:', this.appointmentId); // for debugging
  });
  }

  onSubmit(): void {
  if (this.prescriptionForm.invalid || !this.appointmentId) {
    alert('Please fill all required fields.');
    return;
  }

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  const formData = {
    diagnosis: this.prescriptionForm.value.diagnosis,
    advice: this.prescriptionForm.value.advice,
    date: this.prescriptionForm.value.date
  };

  // ✅ Use appointmentId in the URL path
  const url = `http://localhost:8080/api/prescriptions/${this.appointmentId}`;

  this.http.post(url, formData, { headers }).subscribe({
    next: () => {
      alert('Prescription created successfully!');
      this.router.navigate(['/doctor/prescriptions/view']);
    },
    error: (err) => {
      console.error('Error creating prescription:', err);
      alert('Failed to create prescription.');
    }
  });
}

  }

