import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-appointments',
  templateUrl: './view-appointments.component.html',
  styleUrls: ['./view-appointments.component.css'],
  imports:[CommonModule]
})
export class ViewAppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
  next: (response: any) => {
    this.appointments = response.data; // ✅ Make sure it's an array
  },
  error: (err) => {
    console.error('Error fetching appointments', err);
  }
});

  }
}
