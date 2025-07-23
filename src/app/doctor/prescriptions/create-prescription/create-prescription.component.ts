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
  selectedMedicines: any[] = []; // ✅ for showing selected pills
  todayDate: string = new Date().toISOString().split('T')[0];
  showToast: boolean = false;

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
      date: [this.todayDate, Validators.required],
      dosage: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      durationDays: ['', [Validators.required, Validators.min(1)]],
      medicineIds: [[]] // ✅ will update manually
    });

    this.route.queryParams.subscribe(params => {
      this.appointmentId = +params['appointmentId'];
    });

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
      },
      error: (err) => {
        console.error('❌ Error loading medicines:', err);
        alert('Unable to load medicine list.');
      }
    });
  }

  addMedicine(med: any): void {
    if (!this.selectedMedicines.some(m => m.medicineId === med.medicineId)) {
      this.selectedMedicines.push(med);
      const ids = this.selectedMedicines.map(m => m.medicineId);
      this.prescriptionForm.get('medicineIds')?.setValue(ids);
    }
  }

  removeMedicine(medId: number): void {
    this.selectedMedicines = this.selectedMedicines.filter(m => m.medicineId !== medId);
    const ids = this.selectedMedicines.map(m => m.medicineId);
    this.prescriptionForm.get('medicineIds')?.setValue(ids);
  }

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

    const url = `http://localhost:8080/api/prescriptions/${this.appointmentId}`;
    const payload = this.prescriptionForm.value;

    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        this.showToast = true;
        setTimeout(() => {
          this.router.navigate(['/doctor/prescriptions/view']);
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error creating prescription:', err);
        alert('Failed to create prescription.');
      }
    });
  }
}
