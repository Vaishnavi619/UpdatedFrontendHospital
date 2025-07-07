import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/Prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private baseUrl = 'http://localhost:8080/api/prescriptions';

  constructor(private http: HttpClient) {}

  // ✅ Create Prescription with appointmentId in URL
  createPrescription(appointmentId: number, prescriptionData: any): Observable<Prescription> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const url = `${this.baseUrl}/${appointmentId}`;
    return this.http.post<Prescription>(url, prescriptionData, { headers });
  }

  // ✅ Get all prescriptions
getAllPrescriptions(): Observable<{ message: string; statuscode: number; data: Prescription[] }> {
  return this.http.get<{ message: string; statuscode: number; data: Prescription[] }>(
    'http://localhost:8080/api/prescriptions',
    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    }
  );
}
}
