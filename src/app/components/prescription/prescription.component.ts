import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BackButtonComponent } from '../shared/back-button/back-button.component';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  imports: [BackButtonComponent]
  
})
export class PrescriptionComponent {
  constructor(private router: Router,private http: HttpClient) {}

  goToCreatePrescription(): void {
    // Use hardcoded appointmentId for now
    this.router.navigate(['/doctor/prescriptions/create'], {
      queryParams: { appointmentId: 6 }
    });
  }

  goToViewPrescriptions(): void {
    this.router.navigate(['/doctor/prescriptions/view']);
  }
}
