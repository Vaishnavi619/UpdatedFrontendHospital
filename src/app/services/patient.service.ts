import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  // ✅ Method to get authorization header
 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ required
  });
}


  // ✅ Register new patient
  registerPatient(patient: Patient): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.baseUrl, patient, { headers });
  }

  // ✅ Get all patients
  getAllPatients(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.baseUrl, { headers });
  }

 getPatientById(id: number): Observable<Patient> {
  const headers = this.getAuthHeaders();
  return this.http.get<Patient>(`${this.baseUrl}/${id}`, { headers });
}

deletePatient(patientId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.baseUrl}/${patientId}`, { headers });
}



updatePatient(id: number, patientData: Patient): Observable<any> {
  const headers = this.getAuthHeaders(); // ✅ add headers
  return this.http.put(`${this.baseUrl}/${id}`, patientData, { headers });
}


}


