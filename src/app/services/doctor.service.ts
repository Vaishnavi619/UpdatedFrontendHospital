import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://localhost:8080/api/doctors'; // Update this if needed

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)  // Because your backend returns { statuscode, message, data }
    );
  }

  addDoctor(doctor: Doctor): Observable<any> {
    return this.http.post<any>(this.baseUrl, doctor);
  }

  updateDoctor(doctor: Doctor): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${doctor.doctorId}`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
  registerDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}`, doctor);
  }
  
}
