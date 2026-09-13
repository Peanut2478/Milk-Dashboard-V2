export interface DepartmentHead {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}
export interface Department {
  dep_id: string;
  name: string;
  location: string | null;
  head_staff_id: string | null;
  head_staff: DepartmentHead | null;
}
export interface NewDepartment {
  name: string;
  location: string | null;
  head_staff_id: string | null;
}
