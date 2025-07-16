import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-view-bill',
  templateUrl: './patient-view-bill.component.html',
  styleUrls: ['./patient-view-bill.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientViewBillComponent implements OnInit {
  bills: Bill[] = [];

  constructor(private billService: BillService) {}

   ngOnInit(): void {
    this.billService.getBillsForLoggedInPatient().subscribe({
      next: (response) => {
        console.log('✅ Loaded patient bills:', response);
        this.bills = response.data;  // ✅ Important: use `.data`
      },
      error: (err) => {
        console.error('❌ Error loading bills:', err);
      }
    });
  }


  loadBills(): void {
    this.billService.getAllBills().subscribe({
      next: (response) => {
        this.bills = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch bills:', err);
      }
    });
  }
}
