import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-doctor',
  templateUrl: './update-doctor.component.html',
  imports:[RouterModule,ReactiveFormsModule]
})
export class UpdateDoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  doctorId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorId = +this.route.snapshot.paramMap.get('doctorId')!;
    this.doctorForm = this.fb.group({
      doctorName: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', Validators.required],
      timings: ['', Validators.required]
    });

    this.loadDoctorData();
  }

  loadDoctorData() {
    this.http.get<any>(`http://localhost:8080/api/doctors/${this.doctorId}`).subscribe({
      next: (res) => {
        const doctor = res.data;
        this.doctorForm.patchValue({
          doctorName: doctor.doctorName,
          specialization: doctor.specialization,
          experience: doctor.experience,
          timings: doctor.timings
        });
      },
      error: () => alert('Failed to load doctor details')
    });
  }

  onSubmit() {
    if (this.doctorForm.invalid) return;

    const updatedDoctor = this.doctorForm.value;
    this.http.put(`http://localhost:8080/api/doctors/${this.doctorId}`, updatedDoctor).subscribe({
      next: () => {
        alert('Doctor updated successfully');
        this.router.navigate(['/admin/view-doctors']);
      },
      error: () => alert('Failed to update doctor')
    });
  }
}
