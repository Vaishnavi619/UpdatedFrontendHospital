import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../shared/back-button/back-button.component';

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [RouterModule,BackButtonComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent {
  constructor(public router: Router) {}
}
