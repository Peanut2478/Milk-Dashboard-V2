import { supabase } from "../lib/supabase";
import type { Department, NewDepartment } from "../types/department";

export async function getDepartment(): Promise<Department[]> {
  const { data, error } = await supabase
    .from("departments")
    .select(
      `
        *,
        head_staff:staff!departments_head_staff_id_fkey (
            id,
            first_name,
            last_name,
            role
        )
        `,
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase get departments error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function createDepartment(
  department: NewDepartment,
): Promise<Department> {
  const { data, error } = await supabase
    .from("departments")
    .insert(department)
    .select()
    .single();
  if (error) {
    console.error("Supabase create department error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function updateDepartment(
  id: string,
  updates: NewDepartment,
): Promise<Department> {
  const { data, error } = await supabase
    .from("departments")
    .update(updates)
    .eq("dep_id", id)
    .select()
    .single();
  if (error) {
    console.error("Supabase update department error:", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deleteDepartment(id: string): Promise<void> {
  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("dep_id", id);
  if (error) {
    console.error("Supabase delete department error:", error);
    throw new Error(error.message);
  }
}
