export interface Patient {
  patientId: number;
  patientName: string;
}

export interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  doctor: {
    doctorId: number;
    doctorName: string;
  };
  patient: Patient;
}
