import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../shared/back-button/back-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,BackButtonComponent],
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
  ];

  receptionistItems = [
    { label: 'Manage Appointments', link: '/appointments' },
    { label: 'Manage Patients', link: '/patients' },
    { label: 'Manage Bills', link: '/manage-bill' }
  ];

 patientItems=[
 { label:'Appointments',link:'/patient/appointments'},
 {label:'Prescriptions',link:'/patient/prescriptions'},
 {label:'Bills',link:'/patient/bills'}

 ]
 constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.role === 'SUPER_ADMIN') {
      this.router.navigate(['/superadmin/dashboard']);
    }
  }
}