import { Component } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css'],
  standalone:true,
  imports:[FormsModule]
})
export class RegisterPatientComponent {
  patient: Patient = {
    fullName: '',
    age: 0,
    gender: '',
    phone: 0,
    address: '',
    registeredDate: ''
  };

  constructor(private patientService: PatientService) {}

  onSubmit() {
    this.patientService.registerPatient(this.patient).subscribe({
      next: () => {
        alert("Patient registered successfully!");
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Failed to register patient");
      }
    });
  }
}

