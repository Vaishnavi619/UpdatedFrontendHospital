import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-appointments',
  templateUrl: './view-appointments.component.html',
  styleUrls: ['./view-appointments.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent,FormsModule]
})
export class ViewAppointmentsComponent implements OnInit {
  appointments: any[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentsForLoggedInDoctor().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (err) => {
        console.error('Error fetching doctor appointments', err);
      }
    });
  }

  get filteredAppointments(): any[] {
    const search = this.searchText.toLowerCase();
    return this.appointments.filter(appt =>
      appt.doctor?.doctorName?.toLowerCase().includes(search) ||
      appt.patient?.fullName?.toLowerCase().includes(search) ||
      appt.appointmentDate?.toLowerCase().includes(search) ||
      appt.appointmentTime?.toLowerCase().includes(search) ||
      appt.reason?.toLowerCase().includes(search)
    );
  }

  get paginatedAppointments(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAppointments.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}
