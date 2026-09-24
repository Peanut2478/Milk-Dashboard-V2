# Milk Administration

A full-stack hospital administration dashboard built with Vue 3, TypeScript, Supabase, and PostgreSQL.

The application provides a centralized interface for managing hospital operations including patients, staff, departments, appointments, rooms, supplies, billing, and payroll.

## Features

- User authentication with Supabase Auth
- Role-based access control using PostgreSQL Row Level Security
- Patient management
- Staff management with secure account creation
- Department management
- Appointment scheduling
- Room management and status tracking
- Supply inventory and low-stock monitoring
- Billing and payment tracking
- Payroll processing
- Dashboard statistics and charts
- Search and filtering across major sections
- Responsive administrative interface
- Patient insurance management
- Hospital admissions and discharge tracking
- Medication inventory management
- Prescription management
- Supply usage tracking with automatic inventory updates
- Payment processing with automatic billing balance updates

## Tech Stack

### Frontend

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Chart.js
- vue-chartjs

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)
- PostgreSQL Functions
- Supabase Edge Functions

## Security

The application uses Supabase Authentication and PostgreSQL Row Level Security to restrict database access based on staff roles.

Privileged operations such as creating and deleting staff authentication accounts are handled through Supabase Edge Functions rather than exposing administrative credentials in the frontend.

## Dashboard

The dashboard displays real-time operational information including:

- Total patients
- Total staff
- Today's appointments
- Available rooms
- Low-stock supplies
- Outstanding billing balance
- Appointment status distribution
- Room status distribution

## Project Structure

```text
Milk-Dashboard-V2
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── assets
│   │   └── hero.png
│   ├── components
│   │   ├── appointments
│   │   │   ├── AddAppointmentForm.vue
│   │   │   └── EditAppointments.vue
│   │   ├── billing
│   │   │   ├── AddBillForm.vue
│   │   │   └── EditBillForm.vue
│   │   ├── dashboard
│   │   │   ├── AppointmentStatusChart.vue
│   │   │   ├── DashboardSidebar.vue
│   │   │   ├── DashboardTopbar.vue
│   │   │   ├── RoomStatusChart.vue
│   │   │   └── StatCard.vue
│   │   ├── departments
│   │   │   ├── AddDepartmentForm.vue
│   │   │   └── EditDepartmentForm.vue
│   │   ├── patients
│   │   │   ├── AddPatientForm.vue
│   │   │   ├── EditPatientForm.vue
│   │   │   ├── PatientCard.vue
│   │   │   └── PatientInsurance.vue
│   │   ├── rooms
│   │   │   ├── AddRoomForm.vue
│   │   │   └── EditRoomForm.vue
│   │   ├── staff
│   │   │   ├── AddStaffForm.vue
│   │   │   ├── EditStaffForm.vue
│   │   │   └── StaffCard.vue
│   │   └── supplies
│   │       ├── AddSupplyForm.vue
│   │       └── EditSupplyForm.vue
│   ├── layouts
│   │   └── DashboardLayout.vue
│   ├── lib
│   │   └── supabase.ts
│   ├── router
│   │   └── index.ts
│   ├── services
│   │   ├── admissionService.ts
│   │   ├── appointmentServices.ts
│   │   ├── billingService.ts
│   │   ├── departmentServices.ts
│   │   ├── insuranceService.ts
│   │   ├── medicationService.ts
│   │   ├── patientServices.ts
│   │   ├── paymentService.ts
│   │   ├── payrollService.ts
│   │   ├── perscriptionService.ts
│   │   ├── roomService.ts
│   │   ├── staffServices.ts
│   │   ├── supplyService.ts
│   │   └── supplyUsageServices.ts
│   ├── stores
│   │   └── auth.ts
│   ├── types
│   │   ├── admissions.ts
│   │   ├── appointments.ts
│   │   ├── billing.ts
│   │   ├── department.ts
│   │   ├── insurance.ts
│   │   ├── medications.ts
│   │   ├── patient.ts
│   │   ├── payment.ts
│   │   ├── payroll.ts
│   │   ├── perscriptions.ts
│   │   ├── rooms.ts
│   │   ├── staff.ts
│   │   ├── supplies.ts
│   │   └── supplyUsage.ts
│   ├── views
│   │   ├── auth
│   │   │   ├── LoginView.vue
│   │   │   └── SignUpView.vue
│   │   ├── AdmissionsView.vue
│   │   ├── AppointmentsView.vue
│   │   ├── BillingView.vue
│   │   ├── DashboardView.vue
│   │   ├── DepartmentView.vue
│   │   ├── MedicationsView.vue
│   │   ├── PatientsView.vue
│   │   ├── PayrollView.vue
│   │   ├── PerscriptionsView.vue
│   │   ├── RoomsView.vue
│   │   ├── StaffView.vue
│   │   └── SuppliesView.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── supabase
│   ├── .temp
│   │   ├── cli-latest
│   │   └── linked-project.json
│   └── functions
│       └── create-staff
│           └── index.ts
├── .env
├── .gitignore
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```
