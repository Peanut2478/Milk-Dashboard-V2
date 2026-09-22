import { supabase } from "../lib/supabase";
import type { Bill, NewBill } from "../types/billing";

export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase
    .from("billing")
    .select(
      `
      *,
      patient:patients (
        id,
        first_name,
        last_name
      ),
      appointment:appointments (
        id,
        appointment_date,
        appointment_time
      )
    `,
    )
    .order("bill_date", {
      ascending: false,
    });
  if (error) {
    console.error("Supabase get billing error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function createBill(bill: NewBill): Promise<Bill> {
  const { data, error } = await supabase
    .from("billing")
    .insert(bill)
    .select()
    .single();

  if (error) {
    console.error("Supabase create billing error:", error);

    throw new Error(error.message);
  }

  return data;
}
export async function updateBill(id: string, updates: NewBill): Promise<Bill> {
  const { data, error } = await supabase
    .from("billing")
    .update(updates)
    .eq("bill_id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update bill error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deleteBill(id: string): Promise<void> {
  const { error } = await supabase.from("billing").delete().eq("bill_id", id);
  if (error) {
    console.error("Supabase delete bill error:", error);
    throw new Error(error.message);
  }
}
