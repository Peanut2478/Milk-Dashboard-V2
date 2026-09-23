export interface AdmissionPatient {
  id: string;
  first_name: string;
  last_name: string;
}
export interface AdmissionRoom {
  room_id: string;
  room_number: string;
  status: string;
}
export interface Admission {
  admission_id: string;
  patient_id: string | null;
  room_id: string | null;
  admission_date: string;
  discharge_date: string | null;
  reason: string | null;
  status: string;
  patient: AdmissionPatient | null;
  room: AdmissionRoom | null;
}
export interface NewAdmission {
  patient_id: string | null;
  room_id: string | null;
  admission_date: string;
  discharge_date: string | null;
  reason: string | null;
  status: string;
}
