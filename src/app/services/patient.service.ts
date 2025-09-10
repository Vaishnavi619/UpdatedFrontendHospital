import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:8081/api/patients';

  constructor(private http: HttpClient) {}

  // ✅ Get all patients
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  // ✅ Add new patient
  addPatient(patient: Patient): Observable<any> {
    return this.http.post<any>(this.baseUrl, patient);
  }

  // ✅ Update existing patient
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${patient.patientId}`, patient);
  }

  // ✅ Delete patient by ID
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get patient by ID
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // ✅ Register patient (alias for addPatient)
  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}`, patient);
  }

  getAllDoctors() {
  return this.http.get<any[]>('http://localhost:8081/api/doctors');
}

uploadPatients(file: File): Observable<string> {
  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const formData: FormData = new FormData();
  formData.append('file', file);

  return this.http.post<any>(  // 👈 Make sure it's `any` to access response.data
    'http://localhost:8081/api/patients/upload',
    formData,
    { headers }
  ).pipe(
    map(response => response.data)  // 👈 This will return only the message
  );
}

searchByName(name: string) {
  return this.http.get<Patient[]>(`http://localhost:8081/api/patients/search/name/${name}`);
}

searchByPhone(phone: string) {
  return this.http.get<Patient[]>(`http://localhost:8081/api/patients/search/phone/${phone}`);
}

searchByAddress(address: string) {
  return this.http.get<Patient[]>(`http://localhost:8081/api/patients/search/address/${address}`);
}
searchPatientsByName(name: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/search/name/${name}`);
  }

}
