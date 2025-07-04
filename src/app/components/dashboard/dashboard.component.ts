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
    { label: 'Medicine Dashboard', link: '/medicines' },
     { label: 'Doctor Dashboard', link: '/admin/doctor-dashboard' }
  ];

  doctorItems = [
    { label: 'Appointments', link: '/appointments' },
    { label: 'Prescriptions', link: '/prescriptions' },
    { label: 'Prescription Items', link: '/prescription-items' }
  ];

  receptionistItems = [
    { label: 'Manage Appointments', link: '/appointments' },
    { label: 'Manage Patients', link: '/patients' },
    { label: 'Manage Bills', link: '/bills' }
  ];

  patientItems = [
    { label: 'View Appointments', link: '/appointments' },
    { label: 'My Prescriptions', link: '/prescriptions' }
  ];

 

}
