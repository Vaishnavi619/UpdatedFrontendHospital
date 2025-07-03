import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorForm: Partial<Doctor> = {};
  isEditing = false;
  showSuccess = false;
  editingDoctorId: number | null = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.getAllDoctors();
  }

  getAllDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      }
    });
  }

  submitDoctor() {
    if (this.isEditing && this.editingDoctorId !== null) {
      const updatedDoctor: Doctor = {
        id: this.editingDoctorId,
        ...this.doctorForm
      } as Doctor;

      this.doctorService.updateDoctor(updatedDoctor).subscribe({
        next: () => {
          this.showSuccess = true;
          this.resetForm();
          this.getAllDoctors();
        },
        error: (err) => console.error('Error updating doctor:', err)
      });
    } else {
      this.doctorService.addDoctor(this.doctorForm as Doctor).subscribe({
        next: () => {
          this.showSuccess = true;
          this.resetForm();
          this.getAllDoctors();
        },
        error: (err) => console.error('Error adding doctor:', err)
      });
    }
  }

  editDoctor(doctor: Doctor) {
    this.doctorForm = { ...doctor };
    this.editingDoctorId = doctor.doctorId;
    this.isEditing = true;
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        this.getAllDoctors();
      },
      error: (err) => console.error('Error deleting doctor:', err)
    });
  }

  resetForm() {
    this.doctorForm = {};
    this.editingDoctorId = null;
    this.isEditing = false;

    setTimeout(() => {
      this.showSuccess = false;
    }, 2000);
  }
}
