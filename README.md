# Hospital Administration Dashboard

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
src/
├── components/
├── layouts/
├── router/
├── services/
├── stores/
├── types/
├── views/
├── App.vue
└── main.ts
```
