import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  fetchPrescriptions(): void {
    this.http.get<any>('http://localhost:8080/api/prescriptions')
      .subscribe({
        next: (response) => {
          this.prescriptions = response.data;
        },
        error: (err) => {
          console.error('Failed to fetch prescriptions:', err);
        }
      });
  }

  // ✅ Your Delete Method should go here
  deletePrescription(prescriptionId: number): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.http.delete(`http://localhost:8080/api/prescriptions/${prescriptionId}`)
        .subscribe({
          next: () => {
            alert('Prescription deleted successfully!');
            this.fetchPrescriptions(); // refresh the list
          },
          error: (err: any) => {
            console.error('Delete error:', err);
            alert('Failed to delete prescription.');
          }
        });
    }
  }
}
