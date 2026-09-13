export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  department_id: string | null;
  phone: string | null;
  email: string;
  salary: number;
  hire_date: string;
  status: string;
}
export interface UpdateStaff {
  first_name: string;
  last_name: string;
  role: string;
  department_id: string | null;
  phone: string | null;
  email: string;
  salary: number;
  hire_date: string;
  status: string;
}
export interface NewStaff {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  department_id: string | null;
  phone: string | null;
  salary: number;
  hire_date: string;
  status: string;
}
