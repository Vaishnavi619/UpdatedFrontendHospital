export interface Prescription {
  diagnosis: string;
  advice?: string;
  date: string;
  medicine: {
    medicineId: number;
  };
  dosage: string;
  durationDays: number;
}
