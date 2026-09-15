<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { Patient } from "../../types/patient";
import type { Staff } from "../../types/staff";
import type { Department } from "../../types/department";

import { getPatients } from "../../services/patientServices";
import { getStaff } from "../../services/staffServices";
import { getDepartment } from "../../services/departmentServices";
import { createAppointments } from "../../services/appointmentServices";
const emit = defineEmits<{
  appointmentAdded: [];
}>();

const patientId = ref("");
const staffId = ref("");
const departmentId = ref("");

const appointmentDate = ref("");
const appointmentTime = ref("");
const status = ref("");
const reason = ref("");

const patients = ref<Patient[]>([]);
const staff = ref<Staff[]>([]);
const departments = ref<Department[]>([]);

const submitting = ref(false);
const errorMessage = ref("");

async function loadFormData() {
  try {
    const [patientData, staffData, departmentData] = await Promise.all([
      getPatients(),
      getStaff(),
      getDepartment(),
    ]);
    patients.value = patientData;
    staff.value = staffData;
    departments.value = departmentData;
  } catch (error) {
    console.error("Unable to load appointment form data:", error);
    errorMessage.value = "Unable to load appointment options.";
  }
}

async function handleSubmit() {
  errorMessage.value = "";
  submitting.value = true;
  try {
    await createAppointments({
      patient_id: patientId.value,
      staff_id: staffId.value,
      dep_id: departmentId.value || null,
      appointment_date: appointmentDate.value,
      appointment_time: appointmentTime.value,
      status: status.value,
      reason: reason.value || null,
    });

    patientId.value = "";
    staffId.value = "";
    departmentId.value = "";
    appointmentDate.value = "";
    appointmentTime.value = "";
    status.value = "";
    reason.value = "";

    emit("appointmentAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create appointment.";
    }
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadFormData();
});
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Appointment</h2>
    ``
    <div>
      <label for="appointment-patient"> Patient </label>
      <select id="appointment-patient" v-model="patientId" required>
        <option value="">Select Patient</option>
        <option
          v-for="patient in patients"
          :key="patient.id"
          :value="patient.id"
        >
          {{ patient.first_name }}
          {{ patient.last_name }}
        </option>
      </select>
    </div>
    <div>
      <label for="appointment-staff"> Staff Member </label>
      <select id="appointment-staff" v-model="staffId" required>
        <option value="">Select Staff</option>
        <option v-for="member in staff" :key="member.id" :value="member.id">
          {{ member.first_name }}
          {{ member.last_name }}
          — {{ member.role }}
        </option>
      </select>
    </div>
    <div>
      <label for="appointment-department"> Department </label>
      <select id="appointment-department" v-model="departmentId">
        <option value="">No Department</option>
        <option
          v-for="department in departments"
          :key="department.dep_id"
          :value="department.dep_id"
        >
          {{ department.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="appointment-date"> Date </label>
      <input
        id="appointment-date"
        v-model="appointmentDate"
        type="date"
        required
      />
    </div>
    <div>
      <label for="appointment-time"> Time </label>
      <input
        id="appointment-time"
        v-model="appointmentTime"
        type="time"
        required
      />
    </div>
    <div>
      <label for="appointment-status"> Status </label>
      <input id="appointment-status" v-model="status" type="text" required />
    </div>
    <div>
      <label for="appointment-reason"> Reason </label>
      <textarea id="appointment-reason" v-model="reason"></textarea>
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Appointment" }}
    </button>
  </form>
</template>
