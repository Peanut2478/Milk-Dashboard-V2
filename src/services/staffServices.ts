import { supabase } from "../lib/supabase";
import type { Staff, UpdateStaff, NewStaff } from "../types/staff";
import { FunctionsHttpError } from "@supabase/supabase-js";
export async function getStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) {
    console.error("Supabase get staff error:", error);
    throw new Error(error.message);
  }

  return data;
}
export async function updateStaff(id: string, updates: UpdateStaff) {
  const { data, error } = await supabase
    .from("staff")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Supabase update staff error", error);
    throw new Error(error.message);
  }
  return data;
}

export async function createStaff(staff: NewStaff): Promise<Staff> {
  const { data, error } = await supabase.functions.invoke("create-staff", {
    body: staff,
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      try {
        const errorBody = await error.context.json();

        console.error("EDGE FUNCTION RESPONSE:", errorBody);
      } catch {
        console.error("Could not read Edge Function response body.");
      }
    }

    console.error("Create staff function error:", error);

    throw error;
  }

  return data;
}
export async function deleteStaff(id: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("delete-staff", {
    body: { id },
  });
  if (error) {
    console.error("Delete staff function error:", error);
    throw new Error(error.message);
  }
  if (data?.error) {
    throw new Error(data.error);
  }
}
