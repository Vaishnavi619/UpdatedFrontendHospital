import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,BackButtonComponent]
})
export class AddMedicineComponent implements OnInit {
  medicineForm!: FormGroup;

  constructor(private fb: FormBuilder, private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      isDiscontinued: [false, Validators.required],
      manufacturerName: ['', Validators.required],
      type: ['', Validators.required],
      packSizeLabel: ['', Validators.required],
      shortComposition1: ['', Validators.required],
      shortComposition2: ['']
    });
  }

  // ✅ Allow only digits for price field
  allowOnlyDigits(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  // ✅ Submit Form
  onSubmit() {
    if (this.medicineForm.valid) {
      this.medicineService.addMedicine(this.medicineForm.value).subscribe({
        next: (res) => {
          alert('✅ Medicine added successfully!');
          this.medicineForm.reset({ isDiscontinued: false });
        },
        error: (err) => {
          console.error(err);
          alert('❌ Failed to add medicine');
        }
      });
    }
  }
}
