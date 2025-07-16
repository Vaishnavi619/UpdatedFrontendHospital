import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  // ✅ Get all patients
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  // ✅ Add new patient
  addPatient(patient: Patient): Observable<any> {
    return this.http.post<any>(this.baseUrl, patient);
  }

  // ✅ Update existing patient
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${patient.patientId}`, patient);
  }

  // ✅ Delete patient by ID
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get patient by ID
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // ✅ Register patient (alias for addPatient)
  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}`, patient);
  }

  getAllDoctors() {
  return this.http.get<any[]>('http://localhost:8080/api/doctors');
}
}


