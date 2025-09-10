import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-update-bill',
  templateUrl: './update-bill.component.html',
  styleUrls: ['./update-bill.component.css'],
  imports:[FormsModule,ReactiveFormsModule,CommonModule,BackButtonComponent]
})
export class UpdateBillComponent implements OnInit {
  billForm!: FormGroup;
  billId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Build the form with validation
    this.billForm = this.fb.group({
      consultationFee: ['', [Validators.required, Validators.min(1)]]
    });

    // ✅ Get billId from URL and fetch existing bill
    this.billId = this.route.snapshot.params['billId'];
    this.billService.getBillById(this.billId).subscribe({
      next: (res) => {
        const bill = res.data;
        this.billForm.patchValue({
          consultationFee: bill.consultationFee
        });
      },
      error: (err) => {
        console.error('Error fetching bill:', err);
        alert('Failed to load bill data.');
      }
    });
  }

  updateBill(): void {
    if (this.billForm.invalid) {
      return;
    }

    const updatedBill = {
      consultationFee: this.billForm.value.consultationFee
    };

    this.billService.updateBill(this.billId, updatedBill).subscribe({
      next: () => {
        alert('Bill updated successfully!');
        this.router.navigate(['/view-bills']);
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update bill.');
      }
    });
  }
}
