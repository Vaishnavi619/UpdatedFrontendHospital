import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackButtonComponent]
})
export class CreatePrescriptionComponent implements OnInit {
  prescriptionForm!: FormGroup;
  appointmentId!: number;
  medicines: any[] = [];
  selectedMedicines: any[] = [];
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
      medicineIds: [[]]
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

    this.http.get<any>('http://localhost:8081/api/medicines', { headers }).subscribe({
      next: (response) => {
        // The data is inside the 'data' property of the response
        this.medicines = response.data;
      },
      error: (err) => {
        console.error('❌ Error loading medicines:', err);
        alert('Unable to load medicine list.');
      }
    });
  }

  // ✅ Adds or removes a medicine from the selected list based on checkbox state
  toggleMedicine(medicine: any, event: any): void {
    if (event.target.checked) {
      this.selectedMedicines.push(medicine);
    } else {
      this.selectedMedicines = this.selectedMedicines.filter(m => m.medicineId !== medicine.medicineId);
    }

    // ✅ Updates the form control with the IDs of selected medicines
    const ids = this.selectedMedicines.map(m => m.medicineId);
    this.prescriptionForm.get('medicineIds')?.setValue(ids);
  }

  // ✅ Helper function to display selected medicine names in the dropdown button
  getSelectedMedicineNames(): string {
    return this.selectedMedicines.map(m => m.name).join(', ');
  }

  // ✅ Checks if a medicine is already in the selected list
  isSelected(med: any): boolean {
    return this.selectedMedicines.some(m => m.medicineId === med.medicineId);
  }

  // ✅ Removes a medicine from the selected list when the 'x' button is clicked
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

    if (this.selectedMedicines.length === 0) {
      alert('⚠️ Please select at least one medicine.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const url = `http://localhost:8081/api/prescriptions/${this.appointmentId}`;
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