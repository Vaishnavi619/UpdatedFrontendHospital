import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private baseUrl = 'http://localhost:8080/api/invoices'; // ✅ adjust backend URL

  constructor(private http: HttpClient) {}

  downloadInvoice(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${billId}`, {
      responseType: 'blob'
    });
  }
}
