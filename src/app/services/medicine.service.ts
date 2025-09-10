import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Medicine } from '../models/medicine';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = 'http://localhost:8081/api/medicines';

  constructor(private http: HttpClient) {}

  // ✅ Utility method to get headers with JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // ✅ Add Medicine
  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.baseUrl, medicine, {
      headers: this.getAuthHeaders()
    });
  }

  getAllMedicines(): Observable<Medicine[]> {
  return this.http.get<any>(`${this.baseUrl}`).pipe(
    map(response => response.data ? response.data : response) // handle both cases
  );
}


  // ✅ Get Medicine by ID
  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update Medicine
  updateMedicine(id: number, medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}`, medicine, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete Medicine
  deleteMedicine(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Bulk Upload Medicines via CSV
  uploadMedicines(file: File): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.baseUrl}/upload-medicines`, formData, {
        headers,
        responseType: 'json'
      })
      .pipe(map((res: any) => res.data)); // ✅ Extract success message only
  }
}
