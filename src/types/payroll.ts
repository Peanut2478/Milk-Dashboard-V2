export interface PayrollStaff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}
export interface Payroll {
  payroll_id: string;
  staff_id: string;
  amount: number;
  pay_date: string;
  pay_period_start: string | null;
  pay_period_end: string | null;
  status: string;
  staff_member: PayrollStaff | null;
}
