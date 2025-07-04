import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medicine } from '../models/medicine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = 'http://localhost:8080/api/medicines';

  constructor(private http: HttpClient) {}

  addMedicine(medicine: Medicine): Observable<any> {
    return this.http.post(`${this.baseUrl}`, medicine);
  }

  getAllMedicines(): Observable<any> {
  return this.http.get<any>('http://localhost:8080/api/medicines');
}


  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}/${id}`);
  }

  updateMedicine(id: number, medicine: Medicine): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
 
}

