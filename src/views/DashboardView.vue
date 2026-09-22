<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import StatCard from "../components/dashboard/StatCard.vue";

import { getPatients } from "../services/patientServices";
import { getStaff } from "../services/staffServices";
import { getAppointments } from "../services/appointmentServices";
import { getRooms } from "../services/roomService.ts";
import { getSupplies } from "../services/supplyService.ts";
import { getBills } from "../services/billingService.ts";
import type { Patient } from "../types/patient";
import type { Staff } from "../types/staff";
import type { Appointment } from "../types/appointments";
import type { Room } from "../types/rooms";
import type { Supply } from "../types/supplies";
import type { Bill } from "../types/billing";
import AppointmentStatusChart from "../components/dashboard/AppointmentStatusChart.vue";
import RoomStatusChart from "../components/dashboard/RoomStatusChart.vue";
const patients = ref<Patient[]>([]);
const staff = ref<Staff[]>([]);
const appointments = ref<Appointment[]>([]);
const rooms = ref<Room[]>([]);
const supplies = ref<Supply[]>([]);
const bills = ref<Bill[]>([]);

const loading = ref(true);
const errorMessage = ref("");

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const patientCount = computed(() => {
  return patients.value.length;
});

const staffCount = computed(() => {
  return staff.value.length;
});

const todayAppointments = computed(() => {
  const today = getTodayDate();

  return appointments.value.filter(
    (appointment) => appointment.appointment_date === today,
  ).length;
});

const availableRooms = computed(() => {
  return rooms.value.filter((room) => room.status === "Available").length;
});

const lowStockCount = computed(() => {
  return supplies.value.filter((supply) => {
    if (supply.reorder_level === null) {
      return false;
    }

    return supply.quantity <= supply.reorder_level;
  }).length;
});

const outstandingBilling = computed(() => {
  return bills.value.reduce((total, bill) => {
    if (bill.status === "Cancelled") {
      return total;
    }

    const balance = Number(bill.amount) - Number(bill.amount_paid);

    return total + Math.max(balance, 0);
  }, 0);
});

async function loadDashboard() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [
      patientData,
      staffData,
      appointmentData,
      roomData,
      supplyData,
      billData,
    ] = await Promise.all([
      getPatients(),
      getStaff(),
      getAppointments(),
      getRooms(),
      getSupplies(),
      getBills(),
    ]);

    patients.value = patientData;
    staff.value = staffData;
    appointments.value = appointmentData;
    rooms.value = roomData;
    supplies.value = supplyData;
    bills.value = billData;
  } catch (error) {
    console.error("Unable to load dashboard:", error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load dashboard.";
    }
  } finally {
    loading.value = false;
  }
}
const upcomingAppointments = computed(() => {
  const today = getTodayDate();

  return appointments.value
    .filter((appointment) => appointment.appointment_date >= today)
    .sort((a, b) => {
      const first = `${a.appointment_date} ${a.appointment_time}`;
      const second = `${b.appointment_date} ${b.appointment_time}`;

      return first.localeCompare(second);
    })
    .slice(0, 5);
});

const recentPatients = computed(() => {
  return [...patients.value]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);
});

const lowStockSupplies = computed(() => {
  return supplies.value
    .filter((supply) => {
      if (supply.reorder_level === null) {
        return false;
      }

      return supply.quantity <= supply.reorder_level;
    })
    .slice(0, 5);
});
onMounted(() => {
  loadDashboard();
});
</script>
<template>
  <section>
    <h1>Milk Dashboard</h1>
    <p v-if="loading">Loading dashboard...</p>
    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>
    <div v-else class="stats-grid">
      <StatCard title="Patients" :value="patientCount" />
      <StatCard title="Staff" :value="staffCount" />
      <StatCard title="Today's Appointments" :value="todayAppointments" />
      <StatCard title="Available Rooms" :value="availableRooms" />
      <StatCard title="Low Stock Supplies" :value="lowStockCount" />
      <StatCard
        title="Outstanding Billing"
        :value="`$${outstandingBilling.toFixed(2)}`"
      />
      <div class="dashboard-sections">
        <section class="dashboard-panel">
          <h2>Upcoming Appointments</h2>

          <p v-if="upcomingAppointments.length === 0">
            No upcoming appointments.
          </p>

          <div
            v-for="appointment in upcomingAppointments"
            :key="appointment.id"
            class="dashboard-item"
          >
            <strong v-if="appointment.patient">
              {{ appointment.patient.first_name }}
              {{ appointment.patient.last_name }}
            </strong>

            <p>
              {{ appointment.appointment_date }}
              at
              {{ appointment.appointment_time }}
            </p>

            <p>
              {{ appointment.department?.name ?? "No department" }}
            </p>
          </div>
        </section>

        <section class="dashboard-panel">
          <h2>Recent Patients</h2>

          <p v-if="recentPatients.length === 0">No patients found.</p>

          <div
            v-for="patient in recentPatients"
            :key="patient.id"
            class="dashboard-item"
          >
            <strong>
              {{ patient.first_name }}
              {{ patient.last_name }}
            </strong>

            <p>
              {{ patient.email ?? "No email" }}
            </p>
          </div>
        </section>

        <section class="dashboard-panel">
          <h2>Low Stock Alerts</h2>

          <p v-if="lowStockSupplies.length === 0">
            All supplies are sufficiently stocked.
          </p>

          <div
            v-for="supply in lowStockSupplies"
            :key="supply.supply_id"
            class="dashboard-item"
          >
            <strong>
              {{ supply.name }}
            </strong>
            <p>
              Quantity:
              {{ supply.quantity }}
            </p>
            <p>
              Reorder at:
              {{ supply.reorder_level }}
            </p>
          </div>
        </section>
      </div>
      <div class="charts-grid">
        <AppointmentStatusChart :appointments="appointments" />
        <RoomStatusChart :rooms="rooms" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.dashboard-panel {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
}
.dashboard-panel h2 {
  margin-top: 0;
}
.dashboard-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}
.dashboard-item:last-child {
  border-bottom: none;
}
.dashboard-item p {
  margin: 0.25rem 0;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
</style>
