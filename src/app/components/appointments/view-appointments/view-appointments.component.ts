import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ for navigation
import { AppointmentService } from '../../../services/appointment.service'; // ✅ import your service

@Component({
  standalone: true,
  selector: 'app-view-appointment',
  templateUrl: './view-appointments.component.html',
  styleUrls: ['./view-appointments.component.css'],
  imports: [CommonModule]
})
export class ViewAppointmentComponent implements OnInit {
  appointments: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private appointmentService: AppointmentService // ✅ use service for delete
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // ✅ Method to load all appointments
  loadAppointments(): void {
    this.http.get<any>('http://localhost:8080/api/appointments').subscribe({
      next: (res) => {
        console.log("Full Response:", res);
        this.appointments = res.data;
        this.appointments.forEach((appt, index) => {
          console.log(`Appointment ${index + 1} Patient:`, appt.patient);
        });
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
      }
    });
  }

  // ✅ Navigate to update form
  onEdit(id: number): void {
    this.router.navigate(['/update-appointment', id]);
  }

 onDelete(id: number): void {
  if (confirm('Are you sure you want to delete this appointment?')) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        alert('✅ Appointment deleted successfully!');
        this.loadAppointments(); // Refresh list
      },
      error: (error) => {
        if (error.status === 400 && error.error?.message?.includes('associated')) {
          alert('⚠️ Cannot delete: Appointment is associated with other records.');
        } else if (error.status === 403) {
          alert('🚫 Appointment is associated with other records.');
        } else {
          alert('❌ Failed to delete the appointment. Please try again.');
        }
        console.error('Delete error:', error);
      }
    });
  }
}

}

