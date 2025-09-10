import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Import this
import { BackButtonComponent } from '../shared/back-button/back-button.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,BackButtonComponent], // ✅ Add RouterModule here
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  appointment = {
    appointment_date: '',
    appointment_time: '',
    reason: '',
    doctor_id: null
  };

  constructor(private http: HttpClient) {}

  addAppointment() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('http://localhost:8081/api/appointments', this.appointment, { headers }).subscribe({
      next: () => {
        alert('✅ Appointment scheduled successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error adding appointment:', err);
        alert('Failed to schedule appointment');
      }
    });
  }

  resetForm() {
    this.appointment = {
      appointment_date: '',
      appointment_time: '',
      reason: '',
      doctor_id: null
    };
  }
}
