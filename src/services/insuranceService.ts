import { supabase } from "../lib/supabase";
import type { Insurance, NewInsurance } from "../types/insurance";

export async function getInsuranceByPatient(
  patient_id: string,
): Promise<Insurance[]> {
  const { data, error } = await supabase
    .from("insurance")
    .select("*")
    .eq("patient_id", patient_id)
    .order("coverage_start", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
}
export async function createInsurance(
  insurance: NewInsurance,
): Promise<Insurance> {
  const { data, error } = await supabase
    .from("insurance")
    .insert(insurance)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}
export async function updateInsurance(
  insuranceId: string,
  updates: Partial<NewInsurance>,
): Promise<Insurance> {
  const { data, error } = await supabase
    .from("insurance")
    .update(updates)
    .eq("insurance_id", insuranceId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}
export async function deleteInsurance(insuranceId: string): Promise<void> {
  const { error } = await supabase
    .from("insurance")
    .delete()
    .eq("insurance_id", insuranceId);
  if (error) {
    throw error;
  }
}
