import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-update-medicine',
  templateUrl: './update-medicine.component.html',
  imports: [ReactiveFormsModule, CommonModule, BackButtonComponent],
  standalone: true
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
    this.medicineId = +this.route.snapshot.paramMap.get('medicineId')!;

    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      manufacturerName: ['', Validators.required],
      type: ['', Validators.required],
      packSizeLabel: ['', Validators.required],
      shortComposition1: ['', Validators.required],
      shortComposition2: ['', Validators.required],
      isDiscontinued: [false]
    });

    this.loadMedicineData();
  }

  loadMedicineData() {
    const token = localStorage.getItem('token');
    this.http.get<any>(`http://localhost:8081/api/medicines/${this.medicineId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        const med = res.data;
        this.medicineForm.patchValue(med);
      },
      error: () => alert('❌ Failed to load medicine details')
    });
  }

  onSubmit() {
    if (this.medicineForm.invalid) return;

    const updatedMedicine = this.medicineForm.value;
    const token = localStorage.getItem('token');

    this.http.put(`http://localhost:8081/api/medicines/${this.medicineId}`, updatedMedicine, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('✅ Medicine updated successfully!');
        this.router.navigate(['/admin/view-medicines']);
      },
      error: () => alert('❌ Failed to update medicine')
    });
  }

  allowOnlyDigits(event: KeyboardEvent): void {
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }
}
