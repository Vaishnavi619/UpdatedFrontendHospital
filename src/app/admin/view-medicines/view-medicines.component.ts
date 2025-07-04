import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-medicines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-medicines.component.html',
  styleUrls: ['./view-medicines.component.css']
})
export class ViewMedicinesComponent implements OnInit {
  medicines: any[] = [];

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.fetchMedicines();
  }

  fetchMedicines(): void {
    this.medicineService.getAllMedicines().subscribe({
      next: (response) => {
        // ✅ If response contains 'data', use it; else use response directly
        this.medicines = Array.isArray(response.data) ? response.data : response;
        console.log("Loaded medicines:", this.medicines);
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
      }
    });
  }

  deleteMedicine(id: number): void {
    if (confirm('Are you sure you want to delete this medicine?')) {
      this.medicineService.deleteMedicine(id).subscribe(() => {
        this.fetchMedicines();
      });
    }
  }
}
