import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from '../../services/medicine.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-medicine.component.html',
  styleUrls: ['./update-medicine.component.css']
})
export class UpdateMedicineComponent implements OnInit {
  updateForm!: FormGroup;
  medicineId!: number;

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicineId = Number(this.route.snapshot.paramMap.get('medicineId'));

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantityLeft: ['', [Validators.required, Validators.min(0)]],
    });

    this.medicineService.getMedicineById(this.medicineId).subscribe({
      next: (data) => {
        this.updateForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error fetching medicine:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.medicineService.updateMedicine(this.medicineId, this.updateForm.value).subscribe({
        next: () => {
          alert('Medicine updated successfully!');
          this.router.navigate(['/admin/view-medicines']);
        },
        error: (err) => {
          console.error('Error updating medicine:', err);
        }
      });
    }
  }
}

