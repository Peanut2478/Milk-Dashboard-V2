export interface Medication {
  medication_id: string;
  name: string;
  dosage_form: string | null;
  strength: string | null;
  manufacturer: string | null;
  quantity_in_stock: number;
  reorder_level: number;
}
export interface NewMedication {
  name: string;
  dosage_form: string | null;
  strength: string | null;
  manufacturer: string | null;
  quantity_in_stock: number;
  reorder_level: number;
}
