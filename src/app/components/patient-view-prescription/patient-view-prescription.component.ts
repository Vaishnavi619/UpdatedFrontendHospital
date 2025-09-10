import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../services/prescription.service';
import { BackButtonComponent } from '../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-view-prescription',
  standalone: true,
  imports: [CommonModule,BackButtonComponent,FormsModule],
  templateUrl: './patient-view-prescription.component.html',
  styleUrls: ['./patient-view-prescription.component.css']
})
export class PatientViewPrescriptionComponent implements OnInit {
  prescriptions: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';
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
    this.http.get<any>('http://localhost:8081/api/prescriptions')
      .subscribe({
        next: (response) => {
          this.prescriptions = response.data;
        },
        error: (err) => {
          console.error('Error fetching prescriptions:', err);
        }
      });
  }
   get filteredPrescriptions(): any[] {
    const search = this.searchText.toLowerCase();
    return this.prescriptions.filter(p =>
      p.diagnosis?.toLowerCase().includes(search) ||
      p.advice?.toLowerCase().includes(search) ||
      p.date?.toLowerCase().includes(search) ||
      p.medicineName?.toLowerCase().includes(search) ||
      p.medicinePrice?.toString().includes(search) ||
      p.dosage?.toString().includes(search) ||
      p.durationDays?.toString().includes(search) ||
      p.appointment?.appointmentId?.toString().includes(search) ||
      p.appointment?.patient?.fullName?.toLowerCase().includes(search)
    );
  }

  get paginatedPrescriptions(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPrescriptions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPrescriptions.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}
