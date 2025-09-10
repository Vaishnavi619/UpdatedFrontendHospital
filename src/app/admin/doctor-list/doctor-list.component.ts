import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-doctor-list',
  standalone: true, // ✅ Standalone component
  imports: [CommonModule, HttpClientModule,BackButtonComponent], // ✅ Required modules
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }
}
