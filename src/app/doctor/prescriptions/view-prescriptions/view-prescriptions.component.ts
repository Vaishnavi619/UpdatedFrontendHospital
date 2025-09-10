import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../services/prescription.service';
import { BackButtonComponent } from '../../../components/shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-prescriptions',
  standalone: true,
  imports: [CommonModule, RouterModule,BackButtonComponent,FormsModule],
  templateUrl: './view-prescriptions.component.html',
  styleUrls: ['./view-prescriptions.component.css']
})
export class ViewPrescriptionsComponent implements OnInit {
  prescriptions: any[] = [];

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';
  constructor(
    private http: HttpClient,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.prescriptionService.getPrescriptionsForLoggedInDoctor().subscribe({
      next: (response: any) => {
        console.log("✅ Doctor prescriptions loaded:", response);
        this.prescriptions = response.data;
      },
      error: (err) => {
        console.error("❌ Error loading prescriptions:", err);
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

  fetchPrescriptions(): void {
    this.http.get<any>('http://localhost:8081/api/prescriptions').subscribe({
      next: (response) => {
        console.log('✅ Fetched prescriptions:', response);
        this.prescriptions = response.data;
      },
      error: (err) => {
        console.error('❌ Failed to fetch prescriptions:', err);
        alert('Error fetching prescriptions. Please try again.');
      }
    });
  }

  deletePrescription(prescriptionId: number): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.http.delete(`http://localhost:8081/api/prescriptions/${prescriptionId}`).subscribe({
        next: () => {
          alert('✅ Prescription deleted successfully!');
          this.fetchPrescriptions();
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Delete error:', error);
          if (error.status === 403) {
            alert('❌ You cannot delete this prescription, bill is generated for this prescription.');
          } else if (error.status === 404) {
            alert('❌ Prescription not found.');
          } else {
            alert('❌ Failed to delete prescription. Please try again.');
          }
        }
      });
    }
  }
}
