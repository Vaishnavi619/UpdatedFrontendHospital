import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreatePrescriptionComponent implements OnInit {
  prescriptionForm!: FormGroup;
  appointmentId!: number;
  medicines: any[] = [];
  todayDate: string = new Date().toISOString().split('T')[0];
  showToast: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Initialize form
    this.prescriptionForm = this.fb.group({
      diagnosis: ['', Validators.required],
      advice: [''],
      date: [this.todayDate, Validators.required],
      medicineId: ['', Validators.required],
      dosage: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      durationDays: ['', [Validators.required, Validators.min(1)]]
    });

    // ✅ Get appointment ID from URL
    this.route.queryParams.subscribe(params => {
      this.appointmentId = +params['appointmentId'];
      console.log("✅ Received appointmentId =", this.appointmentId);  // ✅
    });

    // ✅ Load medicine list from backend
    this.loadMedicines();
  }

  loadMedicines(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/api/medicines', { headers }).subscribe({
      next: (response) => {
        this.medicines = response.data;
        console.log("✅ Medicines loaded:", this.medicines);  // ✅
      },
      error: (err) => {
        console.error('❌ Error loading medicines:', err);
        alert('Unable to load medicine list.');
      }
    });
  }

  // ✅ Submit prescription
  onSubmit(): void {
    if (this.prescriptionForm.invalid || !this.appointmentId) {
      alert('Please fill all required fields correctly.');
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
      date: this.prescriptionForm.value.date,
      medicineId: this.prescriptionForm.value.medicineId,
      dosage: this.prescriptionForm.value.dosage,
      durationDays: this.prescriptionForm.value.durationDays
    };

    const url = `http://localhost:8080/api/prescriptions/${this.appointmentId}`;

    // ✅ Log the payload for debugging
    console.log("✅ Sending prescription:", formData);
    console.log("✅ Target URL:", url);

    this.http.post(url, formData, { headers }).subscribe({
      next: () => {
        console.log("✅ Prescription created successfully.");  // ✅
        this.showToast = true;
        setTimeout(() => {
          this.router.navigate(['/doctor/prescriptions/view']);
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error creating prescription:', err);  // ✅ LINE 102
        alert('Failed to create prescription. Please check the form or try again later.');
      }
    });
  }
}
