import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-update-medicine',
  templateUrl: './update-medicine.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class UpdateMedicineComponent implements OnInit {
  medicineForm!: FormGroup;
  medicineId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get medicineId from route
    this.medicineId = Number(this.route.snapshot.paramMap.get('medicineId'));

    // Initialize the form
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantityLeft: ['', [Validators.required, Validators.min(0)]],
    });

    // Fetch and patch existing data
    this.medicineService.getMedicineById(this.medicineId).subscribe({
      next: (data) => {
        this.medicineForm.patchValue({
          name: data.name,
          description: data.description,
          price: data.price,
          quantityLeft: data.quantityLeft,
        });
      },
      error: (err) => {
        console.error('❌ Error loading medicine:', err);
        alert('❌ Failed to load medicine');
      }
    });
  }

  onSubmit(): void {
    if (this.medicineForm.invalid) return;

    this.medicineService.updateMedicine(this.medicineId, this.medicineForm.value).subscribe({
      next: () => {
        alert('✅ Medicine updated successfully!');
        this.router.navigate(['/admin/view-medicines']);
      },
      error: (err) => {
        console.error('❌ Error updating medicine:', err);
        alert('❌ Failed to update medicine');
      }
    });
  }
}
