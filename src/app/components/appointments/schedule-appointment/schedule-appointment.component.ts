import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { DoctorService } from '../../../services/doctor.service';
import { PatientService } from '../../../services/patient.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

type Slot = { startTime: string; endTime: string };

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, BackButtonComponent]
})
export class ScheduleAppointmentComponent implements OnInit {

  // ✅ Matches backend Appointment entity fields
  appointment = {
    appointmentDate: '',
    reason: '',
    doctor: { doctorId: 0 },
    patient: { patientId: 0 },
    startTime: '',
    endTime: '',
     appointmentTime: ''
  };

  doctors: any[] = [];
  patients: any[] = [];
  availableSlots: Slot[] = [];
  availableSlotsLoaded = false;
  todayDate: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (res) => this.doctors = (res as any).data ?? res,
      error: () => alert('❌ Failed to load doctors')
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => this.patients = (res as any).data ?? res,
      error: () => alert('❌ Failed to load patients')
    });
  }

  onDoctorOrDateChange(): void {
    this.availableSlotsLoaded = false;
    this.availableSlots = [];
    this.appointment.startTime = '';
    this.appointment.endTime = '';

    const doctorId = this.appointment.doctor.doctorId;
    const date = this.appointment.appointmentDate;

    if (doctorId && date) {
      console.log('Fetching slots for doctor/date:', doctorId, date);
      this.fetchAvailableSlots(doctorId, date);
    }
  }

  fetchAvailableSlots(doctorId: number, date: string): void {
    this.appointmentService.getAvailableSlots(doctorId, date).subscribe({
      next: (slots: Slot[] | any) => {
        this.availableSlots = Array.isArray(slots) ? slots : (slots?.data ?? []);
        this.availableSlotsLoaded = true;
        console.log('Slots response:', this.availableSlots);
      },
      error: (err) => {
        console.error('Failed to load slots:', err);
        this.availableSlots = [];
        this.availableSlotsLoaded = true;
        alert('❌ Failed to load available slots');
      }
    });
  }

  selectSlot(slot: Slot): void {
    this.appointment.startTime = slot.startTime;
    this.appointment.endTime = slot.endTime;
    console.log('Selected slot:', this.appointment.startTime, '-', this.appointment.endTime);
  }

  onSubmit(): void {
  // ✅ Validate doctor
  if (!this.appointment.doctor || !this.appointment.doctor.doctorId) {
    alert('⚠️ Please select a doctor before submitting');
    return;
  }

  // ✅ Validate patient
  if (!this.appointment.patient || !this.appointment.patient.patientId) {
    alert('⚠️ Please select a patient before submitting');
    return;
  }

  // ✅ Validate date
  if (!this.appointment.appointmentDate) {
    alert('⚠️ Please select an appointment date');
    return;
  }

  // ✅ Validate slot (start & end times)
  if (!this.appointment.startTime || !this.appointment.endTime) {
    alert('⚠️ Please select a time slot');
    return;
  }

  // ✅ Call service
  this.appointmentService.scheduleAppointment(this.appointment).subscribe({
    next: (response) => {
      console.log('✅ Appointment scheduled:', response);
      alert('Appointment scheduled successfully!');
      this.router.navigate(['/appointments/view']);
    },
    error: (error) => {
      console.error('❌ Failed to schedule appointment:', error);
      if (error.status === 403) {
        alert('⚠️ You are not authorized to schedule this appointment.');
      } else {
        alert('Error scheduling appointment. Please try again.');
      }
    }
  });
}

}
