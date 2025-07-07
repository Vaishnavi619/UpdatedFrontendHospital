export interface Bill {
  billId: number;
  billDate: string;
  medicineCharges: number;
  consultationFee: number;
  totalAmount: number;
  patient: {
    patientId: number;
    fullName: string;
  };
  prescription: {
    prescriptionId: number;
    diagnosis: string;
  };
}
