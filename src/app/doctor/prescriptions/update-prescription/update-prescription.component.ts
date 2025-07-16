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
  medicines: any[] = [];

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
      date: ['', Validators.required],
      medicineId: ['', Validators.required],
      dosage: ['', Validators.required],
      durationDays: ['', [Validators.required, Validators.min(1)]]
    });

    this.loadPrescription();
    this.loadMedicines();
  }

  loadPrescription(): void {
    this.http.get<any>(`http://localhost:8080/api/prescriptions/${this.prescriptionId}`).subscribe({
      next: (response) => {
        const prescription = response.data;
        this.prescriptionForm.patchValue({
          diagnosis: prescription.diagnosis,
          advice: prescription.advice,
          date: prescription.date,
          medicineId: prescription.medicine?.medicineId,
          dosage: prescription.dosage,
          durationDays: prescription.durationDays
        });
      },
      error: (err) => console.error('Error loading prescription', err)
    });
  }

  loadMedicines(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/api/medicines', { headers }).subscribe({
      next: (res) => {
        this.medicines = res.data;
      },
      error: (err) => console.error('Error fetching medicines', err)
    });
  }

  onSubmit(): void {
    if (this.prescriptionForm.invalid) {
      alert('Please fill all fields correctly.');
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
      medicine: {
        medicineId: this.prescriptionForm.value.medicineId
      },
      dosage: this.prescriptionForm.value.dosage,
      durationDays: this.prescriptionForm.value.durationDays
    };

    this.http.put(
      `http://localhost:8080/api/prescriptions/${this.prescriptionId}`,
      formData,
      { headers }
    ).subscribe({
      next: () => {
        alert('Prescription updated!');
        this.router.navigate(['/doctor/prescriptions/view']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update');
      }
    });
  }
}
