export interface Insurance {
  insurance_id: string;
  patient_id: string | null;
  provider_name: string;
  policy_number: string;
  group_number: string;
  coverage_start: string | null;
  coverage_end: string | null;
  status: string;
}
export interface NewInsurance {
  patient_id: string;
  provider_name: string;
  policy_number: string;
  group_number: string;
  coverage_start: string | null;
  coverage_end: string | null;
  status: string;
}
