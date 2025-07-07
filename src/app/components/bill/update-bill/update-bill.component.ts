import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';

@Component({
  selector: 'app-update-bill',
  templateUrl: './update-bill.component.html',
  styleUrls: ['./update-bill.component.css'],
  imports:[RouterModule,ReactiveFormsModule]
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
    this.billId = +this.route.snapshot.paramMap.get('billId')!;
    this.loadBill();
  }

  loadBill(): void {
    this.billService.getBillById(this.billId).subscribe({
      next: (response) => {
        const bill = response.data;
        this.billForm = this.fb.group({
          consultationFee: [bill.consultationFee, [Validators.required, Validators.min(0)]],
          medicineCharges: [bill.medicineCharges, [Validators.required, Validators.min(0)]],
        });
      },
      error: (err) => {
        alert('Failed to load bill');
        console.error(err);
      }
    });
  }

  updateBill(): void {
    if (this.billForm.invalid) return;

    const updatedData = this.billForm.value;

    this.billService.updateBill(this.billId, updatedData).subscribe({
      next: () => {
        alert('Bill updated successfully');
        this.router.navigate(['/view-bills']);
      },
      error: (err) => {
        alert('Failed to update bill');
        console.error(err);
      }
    });
  }
}
