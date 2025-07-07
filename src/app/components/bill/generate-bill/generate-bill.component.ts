import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';

@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css'],
  imports:[ReactiveFormsModule]
})
export class GenerateBillComponent implements OnInit {
  billForm!: FormGroup;

  constructor(private fb: FormBuilder, private billService: BillService) {}

  ngOnInit(): void {
    this.billForm = this.fb.group({
      patientId: ['', Validators.required],
      prescriptionId: ['', Validators.required],
      consultationFee: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    const { patientId, prescriptionId, consultationFee } = this.billForm.value;

    this.billService.generateBill(patientId, prescriptionId, consultationFee).subscribe({
      next: (res) => {
        alert('Bill generated successfully!');
        console.log(res);
      },
      error: (err) => {
        alert('Failed to generate bill!');
        console.error(err);
      }
    });
  }
}
