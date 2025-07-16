import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class UpdatePatientComponent implements OnInit {
  patientForm!: FormGroup;
  patientId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],

    });

    this.loadPatientData();
  }

  loadPatientData() {
  const token = localStorage.getItem('token'); // get the JWT from local storage

  this.http.get<any>(`http://localhost:8080/api/patients/${this.patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res) => {
      const patient = res.data;
      this.patientForm.patchValue({
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        registeredDate: patient.registeredDate
      });
    },
    error: () => alert('Failed to load patient details')
  });
}


  onSubmit() {
    
    if (this.patientForm.invalid) return;

    const updatedPatient = this.patientForm.value;
    this.http.put(`http://localhost:8080/api/patients/${this.patientId}`, updatedPatient).subscribe({
      next: () => {
        alert('Patient updated successfully');
        this.router.navigate(['/view-patients']);
      },
      error: () => alert('Failed to update patient')
    });
  }
  preventNegative(event: KeyboardEvent) {
  if (['-', 'e', 'E'].includes(event.key)) {
    event.preventDefault();
  }
}
allowOnlyDigits(event: KeyboardEvent) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.keyCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}

}
