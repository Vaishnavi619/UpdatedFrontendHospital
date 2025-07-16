import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-medicine',
  templateUrl: './update-medicine.component.html',
  imports:[ReactiveFormsModule,CommonModule]
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
      description: ['', Validators.required],
       price: ['', [Validators.required, Validators.min(1)]],
  quantityLeft: ['', [Validators.required, Validators.min(1)]]
    });

    this.loadMedicineData();
  }

  loadMedicineData() {
    const token = localStorage.getItem('token');

    this.http.get<any>(`http://localhost:8080/api/medicines/${this.medicineId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        const med = res.data;
        this.medicineForm.patchValue({
          name: med.name,
          description: med.description,
          price: med.price,
          quantityLeft: med.quantityLeft
        });
      },
      error: () => alert('Failed to load medicine details')
    });
  }

  onSubmit() {
    if (this.medicineForm.invalid) return;

    const updatedMedicine = this.medicineForm.value;
    const token = localStorage.getItem('token');

    this.http.put(`http://localhost:8080/api/medicines/${this.medicineId}`, updatedMedicine, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        alert('✅ Medicine updated successfully!');
        this.router.navigate(['/admin/view-medicines']);
      },
      error: () => alert('❌ Failed to update medicine')
    });
  }

 allowOnlyDigits(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

}
