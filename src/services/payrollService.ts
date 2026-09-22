import { supabase } from "../lib/supabase";

import type { Payroll } from "../types/payroll";

export async function getPayroll(): Promise<Payroll[]> {
  const { data, error } = await supabase
    .from("payroll")
    .select(
      `
      *,
      staff_member:staff (
        id,
        first_name,
        last_name,
        role
      )
    `,
    )
    .order("pay_date", {
      ascending: false,
    });
  if (error) {
    console.error("Supabase get payroll error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function runPayroll(
  payPeriodStart: string,
  payPeriodEnd: string,
): Promise<void> {
  const { error } = await supabase.rpc("pay_employees", {
    p_pay_period_start: payPeriodStart,
    p_pay_period_end: payPeriodEnd,
  });
  if (error) {
    console.error("Supabase run payroll error:", error);
    throw new Error(error.message);
  }
}
