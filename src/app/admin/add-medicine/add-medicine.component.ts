import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  imports:[ReactiveFormsModule,CommonModule]
})
export class AddMedicineComponent implements OnInit {
  medicineForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
     price: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
  quantityLeft: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]]
    });
  }

  onSubmit(): void {
    if (this.medicineForm.valid) {
      this.medicineService.addMedicine(this.medicineForm.value).subscribe({
        next: () => {
          alert('Medicine added successfully');
          this.router.navigate(['/admin/view-medicines']); // update as needed
        },
        error: (err) => {
          alert('Failed to add medicine');
          console.error(err);
        }
      });
    }
  }
 allowOnlyDigits(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}


}
