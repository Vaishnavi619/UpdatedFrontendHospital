import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
  imports: [CommonModule, RouterModule]
})
export class BackButtonComponent {
   constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
