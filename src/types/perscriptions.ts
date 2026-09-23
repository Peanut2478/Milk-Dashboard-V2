export interface PerscriptionPatient {
  id: string;
  first_name: string;
  last_name: string;
}
export interface PerscriptionStaff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}
export interface PerscriptionMedication {
  medication_id: string;
  name: string;
  strength: string | null;
  dosage_form: string | null;
}
export interface Perscription {
  prescription_id: string;
  patient_id: string | null;
  staff_id: string | null;
  medication_id: string | null;
  dosage: string;
  frequency: string;
  duration: string | null;
  prescribed_date: string;
  status: string;

  patient: PerscriptionPatient | null;
  staff_member: PerscriptionStaff | null;
  medication: PerscriptionMedication | null;
}
export interface NewPerscription {
  patient_id: string | null;
  staff_id: string | null;
  medication_id: string | null;
  dosage: string;
  frequency: string;
  duration: string | null;
  prescribed_date: string;
  status: string;
}
