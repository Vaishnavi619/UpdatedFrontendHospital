import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { Medicine } from '../../models/medicine';

@Component({
  selector: 'app-view-medicines',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent, FormsModule],
  templateUrl: './view-medicines.component.html',
  styleUrls: ['./view-medicines.component.css']
})
export class ViewMedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  page: number = 1;
  pageSize: number = 15;
  searchText: string = '';

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.fetchMedicines();
  }

  fetchMedicines(): void {
    this.medicineService.getAllMedicines().subscribe({
      next: (response) => {
        // ✅ unwrap from ResponseStructure
       this.medicines = response || [];
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

  // ✅ Pagination
  get paginatedMedicines(): Medicine[] {
    const filtered = this.filteredMedicines;
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMedicines.length / this.pageSize);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
    }
  }

  // ✅ Updated Search
  get filteredMedicines(): Medicine[] {
    const search = this.searchText.toLowerCase();
    return this.medicines.filter(m =>
      m.name?.toLowerCase().includes(search) ||
      m.manufacturerName?.toLowerCase().includes(search) ||
      m.type?.toLowerCase().includes(search) ||
      m.packSizeLabel?.toLowerCase().includes(search) ||
      m.shortComposition1?.toLowerCase().includes(search) ||
      m.shortComposition2?.toLowerCase().includes(search) ||
      m.price?.toString().includes(search) ||
      (m.discontinued ? 'discontinued' : 'available').includes(search)
    );
  }
}
