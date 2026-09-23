import { supabase } from "../lib/supabase";
import type { Admission, NewAdmission } from "../types/admissions";
export async function getAdmissions(): Promise<Admission[]> {
  const { data, error } = await supabase
    .from("admissions")
    .select(
      `
      admission_id,
      patient_id,
      room_id,
      admission_date,
      discharge_date,
      reason,
      status,
      patient:patients!admissions_patient_id_fkey(
        id,
        first_name,
        last_name
      ),
      room:rooms!admissions_room_id_fkey(
        room_id,
        room_number,
        status
      )
    `,
    )
    .order("admission_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }
  const admissions: Admission[] = (data ?? []).map((admission) => ({
    ...admission,
    patient: Array.isArray(admission.patient)
      ? (admission.patient[0] ?? null)
      : admission.patient,
    room: Array.isArray(admission.room)
      ? (admission.room[0] ?? null)
      : admission.room,
  }));
  return admissions;
}
export async function createAdmission(admission: NewAdmission): Promise<void> {
  const { error } = await supabase.from("admissions").insert(admission);
  if (error) {
    throw error;
  }
}
export async function updateAdmission(
  id: string,
  updates: Partial<NewAdmission>,
): Promise<void> {
  const { error } = await supabase
    .from("admissions")
    .update(updates)
    .eq("admission_id", id);
  if (error) {
    throw error;
  }
}
export async function deleteAdmission(id: string): Promise<void> {
  const { error } = await supabase
    .from("admissions")
    .delete()
    .eq("admission_id", id);
  if (error) {
    throw error;
  }
}
