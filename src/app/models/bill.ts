export interface Bill {
  billId: number;
  billDate: string;
  medicineCharges: number;
  consultationFee: number;
  totalAmount: number;
  
  patient: {
    patientId: number;
    fullName: string;
    phone:number
  };
  prescription: {
    prescriptionId: number;
    diagnosis: string;
  };

   paymentStatus?: 'PAID' | 'UNPAID';
}
