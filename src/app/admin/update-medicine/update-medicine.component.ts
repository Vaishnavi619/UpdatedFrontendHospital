import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-medicine',
  templateUrl: './update-medicine.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class UpdateMedicineComponent implements OnInit {
  medicineForm!: FormGroup;
  medicineId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Get medicine ID from route
    this.medicineId = +this.route.snapshot.paramMap.get('medicineId')!;

    // ✅ Initialize form with backend field names
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],            // 🔁 matches backend field
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantityLeft: ['', Validators.required]      // 🔁 matches backend field
    });

    // ✅ Load and pre-fill form
    this.loadMedicineData();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadMedicineData(): void {
    const headers = this.getAuthHeaders();

    this.http.get<any>(`http://localhost:8080/api/medicines/${this.medicineId}`, { headers }).subscribe({
      next: (res) => {
        const medicine = res.data;
        this.medicineForm.patchValue({
          name: medicine.name,                     // ✅ updated
          description: medicine.description,
          price: medicine.price,
          quantityLeft: medicine.quantityLeft      // ✅ updated
        });
      },
      error: (err) => {
        console.error('❌ Failed to load medicine details', err);
        alert('❌ Failed to load medicine details');
      }
    });
  }

  onSubmit(): void {
    if (this.medicineForm.invalid) return;

    const updatedMedicine = this.medicineForm.value;
    const headers = this.getAuthHeaders();

    this.http.put(`http://localhost:8080/api/medicines/${this.medicineId}`, updatedMedicine, { headers }).subscribe({
      next: () => {
        alert('✅ Medicine updated successfully');
        this.router.navigate(['/admin/view-medicines']);
      },
      error: (err) => {
        console.error('❌ Failed to update medicine', err);
        alert('❌ Failed to update medicine');
      }
    });
  }
}
