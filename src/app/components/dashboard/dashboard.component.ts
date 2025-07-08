import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  role = localStorage.getItem('role');

  adminItems = [
    { label: 'Patient Dashboard', link: '/patients' },
    { label: 'Doctor Dashboard', link: '/admin/doctor-dashboard' },
    { label: 'Medicine Dashboard', link: '/admin/medicine-dashboard' },
  ];

  doctorItems = [
    { label: 'Appointments', link: '/appointments' },
    { label: 'Prescriptions', link: '/prescriptions' },
    { label: 'Prescription Items', link: '/prescription-items' }
  ];

  receptionistItems = [
    { label: 'Manage Appointments', link: '/appointments' },
    { label: 'Manage Patients', link: '/patients' },
    { label: 'Manage Bills', link: '/manage-bill' }
  ];

  patientItems = [
    { label: 'View Appointments', link: '/appointments' },
    { label: 'My Prescriptions', link: '/prescriptions' }
  ];

 

}