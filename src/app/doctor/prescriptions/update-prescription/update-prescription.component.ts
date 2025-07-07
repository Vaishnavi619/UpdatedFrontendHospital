import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-prescription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Add ReactiveFormsModule here
  templateUrl: './update-prescription.component.html',
  styleUrls: ['./update-prescription.component.css']
})

export class UpdatePrescriptionComponent implements OnInit {
  prescriptionForm!: FormGroup;
  prescriptionId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prescriptionId = this.route.snapshot.params['prescriptionId'];

    this.prescriptionForm = this.fb.group({
      diagnosis: ['', Validators.required],
      advice: [''],
      date: ['', Validators.required]
    });

    this.loadPrescription();
  }

  loadPrescription(): void {
    this.http.get<any>(`http://localhost:8080/api/prescriptions/${this.prescriptionId}`).subscribe({
      next: (response) => {
        this.prescriptionForm.patchValue(response.data);
      },
      error: (err) => console.error('Error loading prescription', err)
    });
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `http://localhost:8080/api/prescriptions/${this.prescriptionId}`,
      this.prescriptionForm.value,
      { headers }
    ).subscribe({
      next: () => {
        alert('Prescription updated!');
        this.router.navigate(['/doctor/prescriptions/view']);
      },
      error: (err) => alert('Failed to update')
    });
  }
}
