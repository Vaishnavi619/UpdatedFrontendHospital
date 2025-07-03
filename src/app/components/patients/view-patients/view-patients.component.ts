import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ViewPatientsComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        this.patients = response.data;
      },
      error: (error) => {
        console.error("Failed to load patients", error);
      }
    });
  }

  onEdit(patientId: number | undefined): void {
  if (patientId !== undefined) {
    this.router.navigate(['/update-patient', patientId]);
  }
}

onDelete(patientId: number | undefined): void {
  if (patientId !== undefined) {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      this.patientService.deletePatient(patientId).subscribe({
        next: () => {
          alert("Patient deleted");
          this.patients = this.patients.filter(p => p.patientId !== patientId);
        },
        error: (err) => {
          console.error("Delete error", err);
        }
      });
    }
  }
}

}
