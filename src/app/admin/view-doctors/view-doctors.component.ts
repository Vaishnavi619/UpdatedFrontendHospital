import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-doctors',
  templateUrl: './view-doctors.component.html',
  imports:[CommonModule]
})
export class ViewDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => alert('Failed to load doctors')
    });
  }
}
