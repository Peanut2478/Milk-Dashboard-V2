import { supabase } from "../lib/supabase";
import type { Payment, NewPayment } from "../types/payment";

export async function createPayment(pay: NewPayment): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert(pay)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}
export async function getPaymentsByBill(billId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("bill_id", billId)
    .order("payment_date", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
}
