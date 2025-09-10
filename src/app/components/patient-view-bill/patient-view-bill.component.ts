// No changes needed in this file. The logic is already set up to work
// with the new HTML.

import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackButtonComponent } from '../shared/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-patient-view-bill',
  templateUrl: './patient-view-bill.component.html',
  styleUrls: ['./patient-view-bill.component.css'],
  standalone: true,
  imports: [CommonModule,BackButtonComponent,FormsModule]
})
export class PatientViewBillComponent implements OnInit {
  bills: Bill[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';
  constructor(
    private billService: BillService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.billService.getBillsForLoggedInPatient().subscribe({
      next: (response) => {
        console.log('✅ Loaded patient bills:', response);
        this.bills = response.data;
      },
      error: (err) => {
        console.error('❌ Error loading bills:', err);
      }
    });
  }

  // ✅ Pay button click handler
  payBill(bill: Bill): void {
    const paymentData = {
      patientId: bill.patient.patientId,
      amount: bill.totalAmount
    };

    this.http.post<any>(`${environment.apiBaseUrl}/payments/create-order`, paymentData).subscribe({
      next: (order) => {
        console.log('✅ Razorpay order created:', order);

        const options = {
          key: 'rzp_test_ONcTecOTfNR4YV', 
          amount: order.amount,
          currency: order.currency,
          name: 'Hospital Management System',
          description: 'Bill Payment',
          order_id: order.id,
          handler: (response: any) => {
              this.savePayment(response.razorpay_payment_id, response.razorpay_order_id, 'PAID', bill.billId);
          },
          prefill: {
            name: bill.patient.fullName,
            email: 'patient@example.com',
            contact: bill.patient.phone
          },
          notes: {
            billId: bill.billId.toString()
          },
          theme: {
            color: '#0d6efd'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        console.error('❌ Error creating Razorpay order:', err);
      }
    });
  }

  // ✅ Call backend to save payment details
  savePayment(paymentId: string, orderId: string, status: string, billId: number): void {
    const data = {
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      status: status,
      billId: billId
    };

    this.http.post(`${environment.apiBaseUrl}/payments/save`, data).subscribe({
      next: () => {
        alert('✅ Payment successful!');
        this.loadBills(); // refresh UI
      },
      error: (err) => {
        console.error('❌ Error saving payment:', err);
      }
    });
  }
  
  get filteredBills(): Bill[] {
    const search = this.searchText.toLowerCase();
    return this.bills.filter(bill =>
      bill.patient?.fullName?.toLowerCase().includes(search) ||
      bill.prescription?.diagnosis?.toLowerCase().includes(search) ||
      bill.billDate?.toLowerCase().includes(search) ||
      bill.paymentStatus?.toLowerCase().includes(search) ||
      bill.billId?.toString().includes(search) ||
      bill.totalAmount?.toString().includes(search)
    );
  }

  get paginatedBills(): Bill[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBills.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBills.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  downloadInvoice(billId: number): void {
    this.http.get(`http://localhost:8081/api/invoices/${billId}/download`, {
      responseType: 'blob' // important for PDF
    }).subscribe((res: Blob) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${billId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}