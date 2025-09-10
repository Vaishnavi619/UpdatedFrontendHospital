import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private baseUrl = 'http://localhost:8081/api/bills';

  constructor(private http: HttpClient) {}

  generateBill(patientId: number, prescriptionId: number, consultationFee: number): Observable<any> {
    const body = { consultationFee };
    return this.http.post(`${this.baseUrl}/${patientId}/${prescriptionId}`, body);
  }

   getAllBills(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  deleteBill(billId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${billId}`);
}
getBillById(billId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/${billId}`);
}

updateBill(billId: number, updatedData: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${billId}`, updatedData);
}
getBillsForLoggedInPatient(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get(`${this.baseUrl}/patient/view-bills`, { headers });
}


}
