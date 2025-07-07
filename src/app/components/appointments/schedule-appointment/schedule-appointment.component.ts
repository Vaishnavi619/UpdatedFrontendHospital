import { Component } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
  imports: [FormsModule]
})
export class ScheduleAppointmentComponent {
  appointment = {
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    doctor: {
      doctorId: 0
    },
    patient: {
      patientId: 0
    }
  };

  constructor(private appointmentService: AppointmentService) {}

  onSubmit() {
    this.appointmentService.scheduleAppointment(this.appointment).subscribe({
      next: (response) => {
        console.log('Appointment scheduled:', response);
        alert('Appointment scheduled successfully!');
      },
      error: (error) => {
        console.error('Failed to schedule appointment:', error);
        alert('Error scheduling appointment.');
      }
    });
  }
}
