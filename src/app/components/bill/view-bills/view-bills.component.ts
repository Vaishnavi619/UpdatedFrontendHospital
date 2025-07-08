import { Component, OnInit } from '@angular/core';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bills',
  templateUrl: './view-bills.component.html',
  styleUrls: ['./view-bills.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewBillsComponent implements OnInit {
  bills: Bill[] = [];

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

  onEdit(billId: number): void {
    this.router.navigate(['/update-bill', billId]);
  }

  onDelete(billId: number): void {
    if (confirm('Are you sure you want to delete this bill?')) {
      this.billService.deleteBill(billId).subscribe({
        next: () => {
          alert('Bill deleted successfully');
          this.loadBills(); // Reload list after deletion
        },
        error: (err) => {
          alert('Failed to delete bill');
          console.error(err);
        }
      });
    }
  }
}