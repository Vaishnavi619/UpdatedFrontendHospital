import { Component, OnInit } from '@angular/core';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-bills',
  templateUrl: './view-bills.component.html',
  styleUrls: ['./view-bills.component.css'],
  standalone: true,
  imports: [CommonModule,BackButtonComponent,FormsModule]
})
export class ViewBillsComponent implements OnInit {
  bills: Bill[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  constructor(
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBills();
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

  get paginatedBills(): Bill[] {
  const filtered = this.filteredBills;
  const start = (this.currentPage - 1) * this.pageSize;
  return filtered.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.filteredBills.length / this.pageSize);
}


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onEdit(billId: number): void {
    this.router.navigate(['/admin/update-bill', billId]);
  }

  onDelete(billId: number): void {
    if (confirm('Are you sure you want to delete this bill?')) {
      this.billService.deleteBill(billId).subscribe({
        next: () => {
          alert('Bill deleted successfully');
          this.loadBills();
        },
        error: (err) => {
          alert('Failed to delete bill');
          console.error(err);
        }
      });
    }
  }
  get filteredBills(): Bill[] {
  return this.bills.filter((bill) => {
    const search = this.searchText.toLowerCase();
    return (
      bill.billId.toString().includes(search) ||
      bill.patient.fullName.toLowerCase().includes(search) ||
      bill.prescription.diagnosis.toLowerCase().includes(search) ||
      bill.billDate.toLowerCase().includes(search) ||
      bill.totalAmount.toString().includes(search)
    );
  });
}

}
