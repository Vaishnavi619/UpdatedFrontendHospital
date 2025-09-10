import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient'; // Make sure this path is correct

@Injectable({
  providedIn: 'root'
})
export class PatientSearchService {
  private apiUrl = 'http://localhost:8081/api/patients/search';

  constructor(private http: HttpClient) {}

  searchPatientsByName(name: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/name/${name}`);
  }
}