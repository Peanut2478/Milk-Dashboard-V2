export interface AppointmentPatient {
  id: string;
  first_name: string;
  last_name: string;
}

export interface AppointmentStaff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface AppointmentDepartment {
  dep_id: string;
  name: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  staff_id: string;
  dep_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string | null;

  patient: AppointmentPatient | null;
  staff_member: AppointmentStaff | null;
  department: AppointmentDepartment | null;
}

export interface NewAppointment {
  patient_id: string;
  staff_id: string;
  dep_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string | null;
}
