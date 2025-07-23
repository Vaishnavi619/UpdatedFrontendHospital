import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Medicine } from '../models/medicine';
import { map, Observable } from 'rxjs';

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

  // ✅ Get All Medicines (with token)
  getAllMedicines(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.baseUrl, { headers });
  }

  // ✅ Get by ID (with token)
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

  
  uploadMedicines(file: File): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      'http://localhost:8080/api/medicines/upload-medicines',
      formData,
      { headers, responseType: 'json' }
    ).pipe(
      map((res: any) => res.data) // ✅ Only extract message
    );
  }
}
