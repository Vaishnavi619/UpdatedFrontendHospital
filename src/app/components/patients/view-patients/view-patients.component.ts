import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { PatientSearchService } from '../../../services/patient-search.service';// Import the search service

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css'],
  standalone: true,
  imports: [CommonModule, BackButtonComponent, FormsModule],
   providers: [PatientSearchService] 
})
export class ViewPatientsComponent implements OnInit {
  patients: Patient[] = [];
  searchText: string = '';
  isSearching: boolean = false;
 page: number = 1;
  pageSize: number = 5;
  constructor(
    private patientService: PatientService, 
    private router: Router,
    private patientSearchService: PatientSearchService // Inject the new service
  ) {}

  ngOnInit(): void {
    this.loadAllPatients();
  }

  loadAllPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        this.patients = response;
      },
      error: (error) => {
        console.error("Failed to load patients", error);
      }
    });
  }

 onSearchByName(): void {
    this.page = 1; // Reset page on new search

    // Convert search text to lowercase before sending to backend
    const lowerCaseSearchText = this.searchText.trim().toLowerCase();

    if (!lowerCaseSearchText) {
      this.loadAllPatients();
      return;
    }

    this.isSearching = true;

    this.patientSearchService.searchPatientsByName(lowerCaseSearchText).subscribe({
      next: (response: Patient[]) => {
        this.patients = response;
        this.isSearching = false;
      },
      error: (error: any) => {
        console.error("Fuzzy search failed:", error);
        this.isSearching = false;
      }
    });
  }


  onEdit(patientId: number | undefined): void {
    if (patientId !== undefined) {
      this.router.navigate(['/update-patient', patientId]);
    }
  }

  onDelete(patientId: number | undefined): void {
    if (patientId !== undefined) {
      const confirmDelete = confirm("Are you sure you want to delete?");
      if (confirmDelete) {
        this.patientService.deletePatient(patientId).subscribe({
          next: () => {
            alert("Patient deleted");
            this.patients = this.patients.filter(p => p.patientId !== patientId);
          },
          error: (err) => {
            console.error("Delete error", err);
          }
        });
      }
    }
  }
  get paginatedPatients(): Patient[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.patients.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.patients.length / this.pageSize);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
    }
}
}