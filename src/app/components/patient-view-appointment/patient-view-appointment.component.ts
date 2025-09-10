import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { BackButtonComponent } from '../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-view-appointment',
  standalone: true,
  templateUrl: './patient-view-appointment.component.html',
  styleUrls: ['./patient-view-appointment.component.css'],
  imports: [CommonModule,BackButtonComponent,FormsModule]
})
export class PatientViewAppointmentComponent implements OnInit {
  appointments: any[] = [];
   currentPage: number = 1;
  pageSize: number = 5;
   searchText: string = '';
  constructor(private http: HttpClient,private appointmentService:AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentsForLoggedInPatient().subscribe({
      next: (response) => {
        console.log("✅ Loaded patient appointments:", response);
        this.appointments = response.data;// ✅ make sure you're assigning response.data
      },
      error: (err) => {
        console.error("❌ Error loading appointments:", err);
      }
    });
  }


  loadAppointments(): void {
    this.http.get<any>('http://localhost:8081/api/appointments').subscribe({
      next: (res) => {
        this.appointments = res.data;
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
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
