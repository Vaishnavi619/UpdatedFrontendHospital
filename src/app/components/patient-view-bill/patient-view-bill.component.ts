import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-patient-view-bill',
  templateUrl: './patient-view-bill.component.html',
  styleUrls: ['./patient-view-bill.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientViewBillComponent implements OnInit {
  bills: Bill[] = [];

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
}
,
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

}
