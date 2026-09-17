import { supabase } from "../lib/supabase";
import type { Supply, NewSupply } from "../types/supplies";

export async function getSupplies(): Promise<Supply[]> {
  const { data, error } = await supabase
    .from("supply")
    .select("*")
    .select()
    .order("name", { ascending: true });
  if (error) {
    console.error("Supabhase get supplyu error", error);
    throw new Error(error.message);
  }
  return data;
}

export async function createSupply(supply: NewSupply): Promise<Supply> {
  const { data, error } = await supabase
    .from("supply")
    .insert(supply)
    .select()
    .single();
  if (error) {
    console.error("Create supply erorr", error);
    throw new Error(error.message);
  }
  return data;
}
export async function updateSupply(
  id: string,
  updates: NewSupply,
): Promise<Supply> {
  const { data, error } = await supabase
    .from("supply")
    .update(updates)
    .eq("supply_id", id)
    .select()
    .single();
  if (error) {
    console.error("Supabase cnat update suppkly", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deleteSupply(id: string): Promise<void> {
  const { error } = await supabase.from("supply").delete().eq("supply_id", id);
  if (error) {
    console.error("Cant delete supply", error);
    throw new Error(error.message);
  }
}
