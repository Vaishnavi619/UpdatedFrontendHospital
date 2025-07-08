import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    // 👇 ensure route param matches
    this.patientId = +this.route.snapshot.paramMap.get('id')!;

    // 👇 setup form controls
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
        console.log("🔵 Patient loaded from backend:", res); // <- Debug
        const patient = res;

        // ✅ fill form values
        this.patientForm.patchValue({
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address
        });
      },
      error: (err) => {
        console.error("❌ Error loading patient:", err);
        alert('Failed to load patient data');
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    const updatedPatient = this.patientForm.value;

    this.http.put(`http://localhost:8080/api/patients/${this.patientId}`, updatedPatient).subscribe({
      next: () => {
        alert('✅ Patient updated successfully');
        this.router.navigate(['/view-patients']);
      },
      error: () => alert('❌ Failed to update patient')
    });
  }
}
