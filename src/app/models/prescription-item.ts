import { Prescription } from "./Prescription";
import { Medicine } from "./medicine";

export interface PrescriptionItem {
  prescriptionItemId: number;
  prescription: Prescription;     // ManyToOne relation with Prescription
  medicine: Medicine;             // ManyToOne relation with Medicine
  dosage: string;                 // Add the missing dosage field
}
