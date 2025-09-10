import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { BillService } from '../../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-generate-bill',
  standalone: true,
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css'],
  imports: [CommonModule, ReactiveFormsModule,BackButtonComponent],
})
export class GenerateBillComponent implements OnInit {
  billForm!: FormGroup;
  patients: any[] = [];
  prescriptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private prescriptionService: PrescriptionService,
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Initialize the form with null instead of ''
    this.billForm = this.fb.group({
      patientId: [null, Validators.required],
      prescriptionId: [null, Validators.required],
      consultationFee: [null, [Validators.required, Validators.min(0)]],
    });

    // ✅ Load patient list
    this.patientService.getAllPatients().subscribe({
      next: (res) => {
        this.patients = res;
        console.log('Fetched patients:', this.patients);
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        alert('Failed to load patient list.');
      },
    });

    // ✅ Load prescriptions
    this.prescriptionService.getAllPrescriptions().subscribe({
      next: (res) => {
        console.log('Prescription API raw response:', res);
        this.prescriptions = res?.data || res;
        console.log('Fetched prescriptions:', this.prescriptions);
      },
      error: (err) => {
        console.error('Error fetching prescriptions:', err);
        alert('Failed to load prescription list.');
      },
    });
  }

  // ✅ Compute selected prescription object
  get selectedPrescription() {
    const id = this.billForm?.value?.prescriptionId;
    return this.prescriptions.find((p) => p.prescriptionId === +id);
  }

  onSubmit(): void {
    if (this.billForm.invalid || !this.selectedPrescription) {
      alert('Please fill all fields correctly.');
      return;
    }

    const { patientId, consultationFee } = this.billForm.value;
    const prescriptionId = this.selectedPrescription.prescriptionId;
    const medicinePrice = +this.selectedPrescription.medicinePrice;
    const total = +consultationFee + medicinePrice;

    this.billService
      .generateBill(patientId, prescriptionId, consultationFee)
      .subscribe({
        next: () => {
          alert(`Bill generated! Total: ₹${total}`);
          this.router.navigate(['/view-bills']);
        },
        error: (err) => {
          console.error('Bill generation error:', err);
          alert('Failed to generate bill.');
        },
      });
  }
}
