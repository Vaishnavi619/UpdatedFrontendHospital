import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://localhost:8081/api/doctors';

  constructor(private http: HttpClient) {}

  // ✅ Get all doctors
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  // ✅ Add new doctor
  addDoctor(doctor: Doctor): Observable<any> {
    return this.http.post<any>(this.baseUrl, doctor);
  }

  // ✅ Update existing doctor
  updateDoctor(doctor: Doctor): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${doctor.doctorId}`, doctor);
  }

  // ✅ Delete doctor by ID
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get doctor by ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // ✅ Register doctor (alias for addDoctor)
  registerDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}`, doctor);
  }

  getAllPatients() {
  return this.http.get<any[]>('http://localhost:8081/api/patients');
}

}
