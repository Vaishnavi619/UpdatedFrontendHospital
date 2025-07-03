import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule]

})
export class UpdatePatientComponent implements OnInit {
  patientForm!: FormGroup;
  patientId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params['id'];

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data) => {
        this.patientForm = this.fb.group({
          fullName: [data.fullName],
          age: [data.age],
          gender: [data.gender],
          phone: [data.phone],
          address: [data.address],
        });
      }
    });
  }

  updatePatient() {
  if (this.patientForm.valid && this.patientId) {
    const updatedData = this.patientForm.value;
    console.log('Updating Patient ID:', this.patientId);
    console.log('Updated Data:', updatedData); // ✅ Log for debug

    this.patientService.updatePatient(this.patientId, updatedData).subscribe({
      next: (response) => {
        alert('Patient updated successfully');
        this.router.navigate(['/view-patients']);
      },
      error: (error) => {
        console.error('Failed to update patient', error);
        alert('Update failed');
      }
    });
  }
}

}

  

