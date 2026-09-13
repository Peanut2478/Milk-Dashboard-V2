import { supabase } from "../lib/supabase";
import type { Patient } from "../types/patient";
import type { NewPatient } from "../types/patient";
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
export async function createPatient(patient: NewPatient): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert(patient)
    .select()
    .single();
  if (error) {
    console.error("Supabase create patient error:", error);

    throw new Error(error.message);
  }
  return data;
}
export async function updatePatient(
  id: string,
  patient: NewPatient,
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .update(patient)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update patient error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) {
    console.error("Supabase delete patient error:", error);
    throw new Error(error.message);
  }
}
