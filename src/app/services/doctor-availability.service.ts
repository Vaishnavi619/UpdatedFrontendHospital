import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DoctorAvailability {
  doctorAvailibilityId: number; // matches backend spelling
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

@Injectable({ providedIn: 'root' })
export class DoctorAvailabilityService {
  private baseUrl = 'http://localhost:8081/api/doctor-availability';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /api/doctor-availability/{doctorId}
  getAvailabilityByDoctor(doctorId: number): Observable<DoctorAvailability[]> {
    return this.http.get<DoctorAvailability[]>(
      `${this.baseUrl}/${doctorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // POST /api/doctor-availability/{doctorId}
  addAvailability(doctorId: number, body: { dayOfWeek: string; startTime: string; endTime: string }): Observable<DoctorAvailability> {
    return this.http.post<DoctorAvailability>(
      `${this.baseUrl}/${doctorId}`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  // PUT /api/doctor-availability/{availabilityId}
  updateAvailability(availabilityId: number, body: { dayOfWeek: string; startTime: string; endTime: string }): Observable<DoctorAvailability> {
    return this.http.put<DoctorAvailability>(
      `${this.baseUrl}/${availabilityId}`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  // DELETE /api/doctor-availability/{availabilityId}
  deleteAvailability(availabilityId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${availabilityId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
