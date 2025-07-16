import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { DoctorService } from '../../../services/doctor.service';
import { PatientService } from '../../../services/patient.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule]
})
export class ScheduleAppointmentComponent implements OnInit {
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

  doctors: any[] = [];
  patients: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router
  ) {}
  todayDate: string = '';
  ngOnInit(): void {

     const today = new Date();
  this.todayDate = today.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (res) => this.doctors = res,
      error: () => alert('❌ Failed to load doctors')
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => this.patients = res,
      error: () => alert('❌ Failed to load patients')
    });
  }

  onSubmit(): void {
    this.appointmentService.scheduleAppointment(this.appointment).subscribe({
      next: (response) => {
        console.log('✅ Appointment scheduled:', response);
        alert('Appointment scheduled successfully!');
        this.router.navigate(['/appointments/view']); // 👈 Navigate to view page
      },
      error: (error) => {
        console.error('❌ Failed to schedule appointment:', error);
        alert('Error scheduling appointment.');
      }
    });
  }
}
