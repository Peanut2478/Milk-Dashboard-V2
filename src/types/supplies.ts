export interface Supply {
  supply_id: string;
  name: string;
  quantity: number;
  reorder_level: number | null;
}
export interface NewSupply {
  name: string;
  quantity: number;
  reorder_level: number | null;
}
