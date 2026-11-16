# Milk Dashboard V2

**Full-Stack Hospital Administration System | Vue 3 · TypeScript · Supabase · PostgreSQL**

A full-stack hospital management application designed to centralize administrative operations, streamline data management, and provide real-time visibility into hospital activity.

Built with Vue 3 and TypeScript on the frontend and Supabase PostgreSQL on the backend, the application features relational data management, role-based authorization, automated database workflows, and interactive analytics.

## Live Demo

**[Launch Application](https://milk-dashboard-v2.vercel.app)**

**[Watch Demo Video](https://youtu.be/LSgzfcv4D0k)**

## Key Features

### Hospital Operations Management
- Manage patient profiles, staff records, and hospital departments.
- Schedule and track appointments across departments.
- Monitor room availability, occupancy, and maintenance status.
- Manage patient admissions, discharges, and insurance information.
- Track medication inventory, prescriptions, and medical supplies.

### Billing & Financial Management
- Create and manage patient billing records.
- Record payments and track outstanding balances.
- Automatically update billing balances using PostgreSQL database functions and triggers.
- Manage staff payroll records.

### Authentication & Role-Based Access Control
- Authenticate users through Supabase Auth.
- Enforce database-level permissions using PostgreSQL Row Level Security (RLS).
- Support administrative and department-level staff accounts.
- Maintain staff records independently of authentication accounts.
- Restrict privileged staff-management operations based on user roles.
- Handle privileged authentication operations through Supabase Edge Functions.

### Dashboard Analytics
- Monitor patient and staff counts.
- Track daily appointments and room availability.
- Identify low-stock supplies.
- Monitor outstanding billing balances.
- Visualize appointment and room status distributions using Chart.js.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Vue 3, TypeScript, Vite |
| Routing & State | Vue Router, Pinia |
| Data Visualization | Chart.js, vue-chartjs |
| Backend | Supabase, PostgreSQL |
| Authentication | Supabase Auth |
| Authorization | PostgreSQL Row Level Security |
| Server-Side Logic | PostgreSQL Functions, Triggers, Supabase Edge Functions |
| Deployment | Vercel |

## System Architecture

The application follows a component-based architecture with a separation between frontend views, reusable UI components, data-access services, and backend operations.

**Frontend**
- Vue components implement forms, dashboards, charts, and administrative interfaces.
- TypeScript interfaces define application data models.
- Vue Router manages navigation.
- Pinia manages authentication state.
- Service modules organize database queries and application operations.

**Backend**
- Supabase PostgreSQL stores relational hospital data.
- Foreign keys maintain relationships between patients, appointments, departments, staff, billing, and other records.
- Row Level Security enforces database access policies.
- PostgreSQL functions and triggers automate selected workflows.
- Supabase Edge Functions handle privileged server-side operations.

**Data Flow**

```text
Vue 3 + TypeScript Frontend
          |
          v
Service Layer + Pinia
          |
          v
Supabase Client
          |
          +---- Supabase Auth
          |
          +---- PostgreSQL Database
          |        |
          |        +---- Row Level Security
          |        +---- Relational Data
          |        +---- Functions & Triggers
          |
          +---- Supabase Edge Functions
```

## Technical Highlights

### Hybrid Staff Authentication

Implemented a staff-management model that separates employee records from authentication accounts.

This allows the application to maintain complete staff and department records without requiring every employee to have login credentials.

Authorized staff accounts are linked to employee profiles, allowing role-based access to application functionality.

### Database-Level Authorization

Implemented PostgreSQL Row Level Security policies to restrict access based on authenticated staff roles.

Administrative operations are protected by database-level authorization rather than relying exclusively on frontend visibility controls.

### Automated Billing Updates

Implemented payment tracking integrated with hospital billing records.

Database-side logic supports automatic updates to recorded payment balances, reducing the need for manual synchronization between billing and payment data.

### Inventory Monitoring

Implemented supply inventory tracking, reorder-level monitoring, and supply usage workflows to support hospital resource management.

## Project Structure

```text
src/
├── components/    # Reusable forms, cards, and charts
├── layouts/       # Shared dashboard layout
├── lib/           # Supabase client configuration
├── router/        # Application routing
├── services/      # Database access and operations
├── stores/        # Authentication state
├── types/         # TypeScript data models
└── views/         # Application pages

supabase/
└── functions/     # Server-side Edge Functions
```

## Running Locally

**1. Clone the repository**

```bash
git clone <repository-url>
cd Milk-Dashboard-V2
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_publishable_or_anon_key
```

Use only a Supabase publishable or legacy anon key in the frontend. Never expose service-role or secret keys.

**4. Start the development server**

```bash
npm run dev
```

**5. Open the local application**

```text
http://localhost:5173
```

A configured Supabase backend and appropriate authentication permissions are required to use the application's database-backed features.

## Deployment

The frontend is deployed on Vercel and connects to a Supabase-hosted PostgreSQL database.

**[View Live Application](https://milk-dashboard-v2.vercel.app)**

## Project Status

Deployed full-stack application with hospital administration workflows, relational data management, authentication, role-based authorization, and interactive dashboard analytics.

*Built as a software engineering portfolio project using fictional hospital data.*
