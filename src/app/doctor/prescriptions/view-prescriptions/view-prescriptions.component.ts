import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-prescriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-prescriptions.component.html',
  styleUrls: ['./view-prescriptions.component.css']
})
export class ViewPrescriptionsComponent implements OnInit {
  prescriptions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPrescriptions();
  }

  // ✅ Fetch all prescriptions
  fetchPrescriptions(): void {
    this.http.get<any>('http://localhost:8080/api/prescriptions')
      .subscribe({
        next: (response) => {
          this.prescriptions = response.data;
        },
        error: (err) => {
          console.error('❌ Failed to fetch prescriptions:', err);
          alert('Error fetching prescriptions. Please try again.');
        }
      });
  }

  // ✅ Delete prescription with full error handling
  deletePrescription(prescriptionId: number): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.http.delete(`http://localhost:8080/api/prescriptions/${prescriptionId}`)
        .subscribe({
          next: () => {
            alert('✅ Prescription deleted successfully!');
            this.fetchPrescriptions(); // Refresh list
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
