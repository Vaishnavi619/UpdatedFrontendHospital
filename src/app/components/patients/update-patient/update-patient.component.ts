import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule]
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
  this.patientId = +this.route.snapshot.paramMap.get('id')!;

  // 👇 Check the user's role from the token
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('User role from token:', payload.role || payload.roles);
  }

  this.patientForm = this.fb.group({
    fullName: ['', Validators.required],
    age: ['', Validators.required],
    gender: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  this.loadPatientData();
}

  loadPatientData(): void {
  this.http.get<any>(`http://localhost:8080/api/patients/${this.patientId}`).subscribe({
    next: (res) => {
      const patient = res.data; // ✅ FIXED HERE

      this.patientForm.patchValue({
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address
      });
    },
    error: (err) => {
      alert('❌ Failed to load patient data');
      console.error(err);
    }
  });
}


  onSubmit(): void {
  if (this.patientForm.invalid) return;

  const updatedPatient = this.patientForm.value;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ attach token
  };

  this.http.put(
    `http://localhost:8080/api/patients/${this.patientId}`,
    updatedPatient,
    { headers }
  ).subscribe({
    next: () => {
      alert('✅ Patient updated successfully');
      this.router.navigate(['/view-patients']);
    },
    error: (err) => {
      console.error(err);
      alert('❌ Failed to update patient');
    }
  });
}
}
