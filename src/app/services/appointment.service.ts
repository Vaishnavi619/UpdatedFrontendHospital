import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment'; // ✅ Import Appointment model

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  // ✅ Auth headers for secured API
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Update appointment by ID
  updateAppointment(id: number, data: Appointment): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete appointment by ID
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // (Optional) Add a getAllAppointments() method if needed
  getAllAppointments() {
  const token = localStorage.getItem('token');
  return this.http.get<any[]>('http://localhost:8080/api/appointments', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

  scheduleAppointment(appointment: any): Observable<any> {
  return this.http.post(this.baseUrl, appointment, {
    headers: this.getAuthHeaders()
  });
}
getAppointmentById(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/${id}`, {
    headers: this.getAuthHeaders()
  });
}
getAppointmentsForLoggedInDoctor(): Observable<Appointment[]> {
  return this.http.get<Appointment[]>(`${this.baseUrl}/doctor/appointments`);
}
getAppointmentsForLoggedInPatient(): Observable<{ statuscode: number, message: string, data: Appointment[] }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<{ statuscode: number, message: string, data: Appointment[] }>(
    `${this.baseUrl}/patient/appointments`, { headers }
  );
}





}
