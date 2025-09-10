import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,BackButtonComponent],
  templateUrl: './update-appointment.component.html',
})
export class UpdateAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  appointmentId!: number;
  isFormReady = false;

  todayDate: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const today = new Date();
  this.todayDate = today.toISOString().split('T')[0];
  
    this.appointmentId = +this.route.snapshot.params['id']; // ensure it's a number
    console.log("Editing appointment with ID:", this.appointmentId);

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (res) => {
        const a = res.data;
        console.log("Loaded appointment data:", a);

        this.appointmentForm = this.fb.group({
          appointmentDate: [a.appointmentDate, Validators.required],
          appointmentTime: [a.appointmentTime, Validators.required],
          reason: [a.reason, Validators.required],
        });

        this.isFormReady = true; // allow template to render form
      },
      error: (err) => {
        console.error('Failed to load appointment:', err);
        alert('Unable to fetch appointment details.');
      }
    });
  }

  updateAppointment(): void {
    if (this.appointmentForm.valid) {
      const updatedData = this.appointmentForm.value;

      this.appointmentService.updateAppointment(this.appointmentId, updatedData).subscribe({
        next: () => {
          alert('Appointment updated successfully!');
          this.router.navigate(['/appointments/view']);
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Failed to update appointment');
        }
      });
    } else {
      alert("Please fill in all fields correctly.");
    }
  }

  getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
}
