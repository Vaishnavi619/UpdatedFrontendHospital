import { PrescriptionItem } from "./prescription-item";
import { Appointment } from './appointment';

export interface Prescription {
  prescriptionId: number;
  diagnosis: string;
  advice: string;
  date: string; // Use string if coming from backend as ISO date string
  items: PrescriptionItem[];
  appointment: Appointment;
}
