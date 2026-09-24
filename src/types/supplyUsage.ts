export interface SupplyUsage {
  usage_id: string;
  supply_id: string | null;
  staff_id: string | null;
  quantity_used: number;
  usage_date: string;
  dep_id: string | null;
  notes: string | null;
}

export interface NewSupplyUsage {
  supply_id: string | null;
  staff_id: string | null;
  quantity_used: number;
  usage_date: string;
  dep_id: string | null;
  notes: string | null;
}
