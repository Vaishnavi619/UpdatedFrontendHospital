import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../services/prescription.service';

@Component({
  selector: 'app-patient-view-prescription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-view-prescription.component.html',
  styleUrls: ['./patient-view-prescription.component.css']
})
export class PatientViewPrescriptionComponent implements OnInit {
  prescriptions: any[] = [];

  constructor(private http: HttpClient,private prescriptionService:PrescriptionService) {}

  ngOnInit(): void {
    this.prescriptionService.getPrescriptionsForLoggedInPatient().subscribe({
      next: (response) => {
        console.log("✅ Loaded patient prescriptions:", response);
        this.prescriptions = response.data;
      },
      error: (err) => {
        console.error("❌ Error loading prescriptions:", err);
      }
    });
  }


  fetchPrescriptions(): void {
    this.http.get<any>('http://localhost:8080/api/prescriptions')
      .subscribe({
        next: (response) => {
          this.prescriptions = response.data;
        },
        error: (err) => {
          console.error('Error fetching prescriptions:', err);
        }
      });
  }
}
