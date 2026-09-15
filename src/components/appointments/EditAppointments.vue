<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import type { Appointment } from "../../types/appointments";
import type { Patient } from "../../types/patient";
import type { Staff } from "../../types/staff";
import type { Department } from "../../types/department";

import { getPatients } from "../../services/patientServices";
import { getStaff } from "../../services/staffServices";
import { getDepartment } from "../../services/departmentServices";
import { updateAppointment } from "../../services/appointmentServices";

const props = defineProps<{ appointment: Appointment }>();
const emit = defineEmits<{
  appointmentUpdated: [];
  cancel: [];
}>();
const form = reactive({
  patient_id: props.appointment.patient_id,
  staff_id: props.appointment.staff_id,
  department_id: props.appointment.dep_id ?? "",
  appointment_date: props.appointment.appointment_date,
  appointment_time: props.appointment.appointment_time,
  status: props.appointment.status,
  reason: props.appointment.reason ?? "",
});
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
    console.error("Unable to load appointment options:", error);

    errorMessage.value = "Unable to load appointment options.";
  }
}
async function handleSubmit() {
  errorMessage.value = "";
  submitting.value = true;

  try {
    await updateAppointment(props.appointment.id, {
      patient_id: form.patient_id,
      staff_id: form.staff_id,
      dep_id: form.department_id || null,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      status: form.status,
      reason: form.reason || null,
    });

    emit("appointmentUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to update appointment.";
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
    <h2>Edit Appointment</h2>

    <div>
      <label for="edit-appointment-patient"> Patient </label>

      <select id="edit-appointment-patient" v-model="form.patient_id" required>
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
      <label for="edit-appointment-staff"> Staff Member </label>

      <select id="edit-appointment-staff" v-model="form.staff_id" required>
        <option v-for="member in staff" :key="member.id" :value="member.id">
          {{ member.first_name }}
          {{ member.last_name }}
          — {{ member.role }}
        </option>
      </select>
    </div>

    <div>
      <label for="edit-appointment-department"> Department </label>

      <select id="edit-appointment-department" v-model="form.department_id">
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
      <label for="edit-appointment-date"> Date </label>

      <input
        id="edit-appointment-date"
        v-model="form.appointment_date"
        type="date"
        required
      />
    </div>

    <div>
      <label for="edit-appointment-time"> Time </label>

      <input
        id="edit-appointment-time"
        v-model="form.appointment_time"
        type="time"
        required
      />
    </div>

    <div>
      <label for="edit-appointment-status"> Status </label>

      <input
        id="edit-appointment-status"
        v-model="form.status"
        type="text"
        required
      />
    </div>

    <div>
      <label for="edit-appointment-reason"> Reason </label>

      <textarea id="edit-appointment-reason" v-model="form.reason"></textarea>
    </div>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <button type="submit" :disabled="submitting">
      {{ submitting ? "Saving..." : "Save Changes" }}
    </button>

    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
