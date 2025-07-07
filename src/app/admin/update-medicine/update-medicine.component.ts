import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

    // ✅ Initialize form
    this.medicineForm = this.fb.group({
      medicineName: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      quantity: [0, Validators.required]
    });

    // ✅ Load and pre-fill data
    this.loadMedicineData();
  }

  loadMedicineData(): void {
   this.http.get<any>(`http://localhost:8080/api/medicines/${this.medicineId}`).subscribe({
  next: (res) => {
    const medicine = res.data; // ✅ confirmed correct
    console.log("Form after patchValue:", this.medicineForm.value);
// Add this line to debug

    this.medicineForm.patchValue({
      medicineName: medicine.medicineName,
      description: medicine.description,
      price: medicine.price,
      quantity: medicine.quantity
    });
  },
  error: () => {
    alert('Failed to load medicine details');
  }
});

  }

  onSubmit(): void {
    if (this.medicineForm.invalid) return;

    const updatedMedicine = this.medicineForm.value;
    this.http.put(`http://localhost:8080/api/medicines/${this.medicineId}`, updatedMedicine).subscribe({
      next: () => {
        alert('✅ Medicine updated successfully');
        this.router.navigate(['/admin/view-medicines']);
      },
      error: () => {
        alert('❌ Failed to update medicine');
      }
    });
  }
}
