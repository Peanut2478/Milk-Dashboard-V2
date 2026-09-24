export interface Payment {
  payment_id: string;
  bill_id: string;
  patient_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
}
export interface NewPayment {
  bill_id: string;
  patient_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
}
