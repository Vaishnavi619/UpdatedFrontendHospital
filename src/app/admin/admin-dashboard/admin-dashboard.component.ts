import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule for routerLink
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, // ✅ Make sure this is true if you're using standalone components
  imports: [CommonModule, RouterModule,BackButtonComponent], // ✅ Add RouterModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent { }
