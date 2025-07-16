import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-patient-view-appointment',
  standalone: true,
  templateUrl: './patient-view-appointment.component.html',
  styleUrls: ['./patient-view-appointment.component.css'],
  imports: [CommonModule]
})
export class PatientViewAppointmentComponent implements OnInit {
  appointments: any[] = [];

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
    this.http.get<any>('http://localhost:8080/api/appointments').subscribe({
      next: (res) => {
        this.appointments = res.data;
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
      }
    });
  }
}
