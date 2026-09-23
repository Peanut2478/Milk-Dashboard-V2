import { supabase } from "../lib/supabase";
import type { Medication, NewMedication } from "../types/medications";

export async function getMedications(): Promise<Medication[]> {
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .order("name");

  console.log("MEDICATION DATA:", data);
  console.log("MEDICATION ERROR:", error);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createMedication(
  medication: NewMedication,
): Promise<void> {
  const { error } = await supabase.from("medications").insert(medication);
  if (error) {
    throw error;
  }
}

export async function updateMedication(
  id: string,
  updates: Partial<NewMedication>,
): Promise<void> {
  const { error } = await supabase
    .from("medications")
    .update(updates)
    .eq("medication_id", id);
  if (error) {
    throw error;
  }
}

export async function deleteMedication(id: string): Promise<void> {
  const { error } = await supabase
    .from("medications")
    .delete()
    .eq("medication_id", id);
  if (error) {
    throw error;
  }
}
