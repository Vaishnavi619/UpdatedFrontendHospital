import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-doctors',
  templateUrl: './view-doctors.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule,BackButtonComponent,FormsModule    ],
})
export class ViewDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  page: number = 1;
  pageSize: number = 5;
  searchText: string = '';
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
          this.loadDoctors(); 
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

  get paginatedDoctors(): Doctor[] {
  const start = (this.page - 1) * this.pageSize;
  return this.filteredDoctors.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.filteredDoctors.length / this.pageSize);
}

goToPage(pageNumber: number): void {
  if (pageNumber >= 1 && pageNumber <= this.totalPages) {
    this.page = pageNumber;
  }
}
get filteredDoctors(): Doctor[] {
  const search = this.searchText.toLowerCase();
  return this.doctors.filter((d) =>
    d.doctorName.toLowerCase().includes(search) ||
    d.specialization.toLowerCase().includes(search) ||
    d.experience.toString().includes(search) ||
    d.timings.toLowerCase().includes(search)
  );
}
setAvailability(doctorId: number) {
  this.router.navigate(['/doctor-availability', doctorId]);
}
}
