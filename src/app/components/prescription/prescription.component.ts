import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent {
  constructor(private router: Router) {}

  goToCreatePrescription(): void {
    // Use hardcoded appointmentId for now
    this.router.navigate(['/doctor/prescriptions/create'], {
      queryParams: { appointmentId: 8 }
    });
  }

  goToViewPrescriptions(): void {
    this.router.navigate(['/doctor/prescriptions/view']);
  }
}
