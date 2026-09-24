import { supabase } from "../lib/supabase";
import type { NewSupplyUsage, SupplyUsage } from "../types/supplyUsage";
export async function createSupplyUsage(
  usage: NewSupplyUsage,
): Promise<SupplyUsage> {
  const { data, error } = await supabase
    .from("supply_usage")
    .insert(usage)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}
