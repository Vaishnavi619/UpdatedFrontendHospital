export interface Patient {
  patientId?: number;
  fullName: string;
  age: number;
  gender: string;
  phone: number;
  address: string;
  registeredDate: string; 
  email?: string;
}
