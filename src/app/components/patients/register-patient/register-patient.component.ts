import { Component } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css'],
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class RegisterPatientComponent {
  patient: Patient = {
    fullName: '',
    age: 1,
    gender: '',
    phone: 0,
    address: '',
    registeredDate: ''
  };

  constructor(private patientService: PatientService,private route:Router) {}



  todayDate: string = '';

ngOnInit(): void {
  const today = new Date();
  this.todayDate = today.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
}

  onSubmit() {
     if (this.patient.age <= 0) {
    alert("Age must be greater than 0");
    return;
  }

    this.patientService.registerPatient(this.patient).subscribe({
      next: () => {
        alert("Patient registered successfully!");
        this.route.navigate(['/view-patients'])
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Failed to register patient");
      }
    });
  }

 allowOnlyDigitss(event: KeyboardEvent): void {
  const char = event.key;
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault(); // block non-digit
  }
}

allowOnlyDigits(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

}

