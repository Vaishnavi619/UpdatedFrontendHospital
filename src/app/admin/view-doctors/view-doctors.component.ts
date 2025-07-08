import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-doctors',
  templateUrl: './view-doctors.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ViewDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => alert('❌ Failed to load doctors')
    });
  }

  deleteDoctor(doctorId: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(doctorId).subscribe({
        next: () => {
          alert('✅ Doctor deleted successfully!');
          this.loadDoctors(); // Refresh the list
        },
        error: (error) => {
          if (error.status === 400 && error.error?.data?.includes('associated with one or more appointments')) {
            alert('❌ Cannot delete doctor: Doctor is associated with one or more appointments.');
          } else if (error.status === 403) {
            alert('🚫 Doctor is associated with one or more appointments.');
          } else {
            alert('❌ Failed to delete doctor. Please try again.');
          }
          console.error('Delete error:', error);
        }
      });
    }
  }
}
