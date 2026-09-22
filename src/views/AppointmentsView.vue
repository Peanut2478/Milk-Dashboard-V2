<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { Appointment } from "../types/appointments";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointmentServices";
import AddAppointmentForm from "../components/appointments/AddAppointmentForm.vue";
import EditAppointments from "../components/appointments/EditAppointments.vue";
const appointments = ref<Appointment[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const selectedAppointment = ref<Appointment | null>(null);

function editAppointment(appointment: Appointment) {
  selectedAppointment.value = appointment;
}

async function handleAppointmentUpdated() {
  selectedAppointment.value = null;
  await loadAppointments();
}
async function loadAppointments() {
  loading.value = true;
  errorMessage.value = "";

  try {
    appointments.value = await getAppointments();
    console.log("Appointments:", appointments.value);
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load appointments.";
    }
  } finally {
    loading.value = false;
  }
}
async function handleDeleteAppointment(appointment: Appointment) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this appointment?",
  );
  if (!confirmed) {
    return;
  }
  try {
    await deleteAppointment(appointment.id);
    await loadAppointments();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete appointment.";
    }
  }
}

const selectedDate = ref("");
const selectedStatus = ref("");
const filteredAppointments = computed(() => {
  return appointments.value.filter((appointment) => {
    const matchesDate =
      !selectedDate.value ||
      appointment.appointment_date === selectedDate.value;
    const matchesStatus =
      !selectedStatus.value || appointment.status === selectedStatus.value;
    return matchesDate && matchesStatus;
  });
});
function showToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  selectedDate.value = `${year}-${month}-${day}`;
}
onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <section>
    <h1>Appointments</h1>
    <div class="appointment-filters">
      <div>
        <label for="filter-date"> Date </label>
        <input id="filter-date" v-model="selectedDate" type="date" />
      </div>

      <div>
        <label for="filter-status"> Status </label>
        <select id="filter-status" v-model="selectedStatus">
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="button"
        @click="
          selectedDate = '';
          selectedStatus = '';
        "
      >
        Clear Filters
      </button>
    </div>
    <button type="button" @click="showToday">Today</button>
    <AddAppointmentForm @appointment-added="loadAppointments" />
    <EditAppointments
      v-if="selectedAppointment"
      :appointment="selectedAppointment"
      @appointment-updated="handleAppointmentUpdated"
      @cancel="selectedAppointment = null"
    />

    <p v-if="loading">Loading appointments...</p>
    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p v-else-if="appointments.length === 0">No appointments found.</p>
    <p
      v-if="
        !loading && appointments.length > 0 && filteredAppointments.length === 0
      "
    >
      No appointments match these filters.
    </p>

    <div v-else>
      <article
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
      >
        <h3 v-if="appointment.patient">
          {{ appointment.patient.first_name }}
          {{ appointment.patient.last_name }}
        </h3>
        <p v-if="appointment.staff_member">
          Staff:
          {{ appointment.staff_member.first_name }}
          {{ appointment.staff_member.last_name }}
          —
          {{ appointment.staff_member.role }}
        </p>
        <p>
          Department:
          {{ appointment.department?.name ?? "Not assigned" }}
        </p>
        <p>
          Date:
          {{ appointment.appointment_date }}
        </p>
        <p>
          Time:
          {{ appointment.appointment_time }}
        </p>
        <p>
          Status:
          {{ appointment.status }}
        </p>
        <p>
          Reason:
          {{ appointment.reason ?? "No reason provided" }}
        </p>
        <button @click="editAppointment(appointment)">Edit</button>
        <button @click="handleDeleteAppointment(appointment)">Delete</button>
      </article>
    </div>
  </section>
</template>
