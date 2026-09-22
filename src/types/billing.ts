export interface BillingPatient {
  id: string;
  first_name: string;
  last_name: string;
}
export interface BillingAppointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
}
export interface Bill {
  bill_id: string;
  patient_id: string | null;
  appointment_id: string | null;
  amount: number;
  description: string | null;
  bill_date: string;
  status: string;
  amount_paid: number | null;
  patient: BillingPatient | null;
  appointment: BillingAppointment | null;
}
export interface NewBill {
  patient_id: string | null;
  appointment_id: string | null;
  amount: number;
  amount_paid: number | null;
  description: string | null;
  bill_date: string;
  status: string;
}
