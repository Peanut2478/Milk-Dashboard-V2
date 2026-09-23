import { supabase } from "../lib/supabase";
import type { Perscription, NewPerscription } from "../types/perscriptions";
export async function getPerscription(): Promise<Perscription[]> {
  const { data, error } = await supabase
    .from("prescriptions")
    .select(
      `
      prescription_id,
      patient_id,
      staff_id,
      medication_id,
      dosage,
      frequency,
      duration,
      prescribed_date,
      status,

      patient:patients!prescriptions_patient_id_fkey(
        id,
        first_name,
        last_name
      ),

      staff_member:staff!prescriptions_staff_id_fkey(
        id,
        first_name,
        last_name,
        role
      ),

      medication:medications!prescriptions_medication_id_fkey(
        medication_id,
        name,
        strength,
        dosage_form
      )
    `,
    )
    .order("prescribed_date", {
      ascending: false,
    });

  if (error) {
    console.error("Prescription fetch error:", error);
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,

    patient: Array.isArray(item.patient)
      ? (item.patient[0] ?? null)
      : item.patient,
    staff_member: Array.isArray(item.staff_member)
      ? (item.staff_member[0] ?? null)
      : item.staff_member,
    medication: Array.isArray(item.medication)
      ? (item.medication[0] ?? null)
      : item.medication,
  })) as Perscription[];
}

export async function createPrescription(
  prescription: NewPerscription,
): Promise<void> {
  const { error } = await supabase
    .from("prescriptions")
    .insert(prescription)
    .select()
    .single();
  if (error) {
    throw error;
  }
}
export async function updatePrescription(
  id: string,
  updates: Partial<NewPerscription>,
): Promise<void> {
  const { error } = await supabase
    .from("prescriptions")
    .update(updates)
    .eq("prescription_id", id);
  if (error) {
    throw error;
  }
}
export async function deletePrescription(id: string): Promise<void> {
  const { error } = await supabase
    .from("prescriptions")
    .delete()
    .eq("prescription_id", id);

  if (error) {
    throw error;
  }
}
