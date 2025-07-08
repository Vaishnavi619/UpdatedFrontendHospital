import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Medicine } from '../models/medicine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = 'http://localhost:8080/api/medicines';

  constructor(private http: HttpClient) {}

  // ✅ Utility method to get headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Add Medicine (with token)
  addMedicine(medicine: Medicine): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}`, medicine, { headers });
  }

  // ✅ Get All Medicines (usually public or ADMIN-only)
  getAllMedicines(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.baseUrl, { headers });
  }

  // ✅ Get by ID (include token)
  getMedicineById(id: number): Observable<Medicine> {
    const headers = this.getAuthHeaders();
    return this.http.get<Medicine>(`${this.baseUrl}/${id}`, { headers });
  }

  // ✅ Update Medicine (with token)
  updateMedicine(id: number, medicine: Medicine): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/${id}`, medicine, { headers });
  }

  // ✅ Delete Medicine (with token)
  deleteMedicine(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
