import { supabase } from "../lib/supabase";

import type { Appointment, NewAppointment } from "../types/appointments";
export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:patients (
        id,
        first_name,
        last_name
      ),
      staff_member:staff (
        id,
        first_name,
        last_name,
        role
      ),
      department:departments (
        dep_id,
        name
      )
    `,
    )
    .order("appointment_date", {
      ascending: true,
    });

  if (error) {
    console.error("Supabase get appointments error:", error);

    throw new Error(error.message);
  }

  return data;
}
export async function createAppointments(
  appointment: NewAppointment,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointment)
    .select()
    .single();
  if (error) {
    console.error("Supabase create appointjmentr erorr:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function updateAppointment(
  id: string,
  updates: NewAppointment,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Supabase update appt error: ", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) {
    console.error("Supabase delete appointment error:", error);
    throw new Error(error.message);
  }
}
