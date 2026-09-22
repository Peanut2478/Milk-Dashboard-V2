<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Patient } from "../../types/patient";
import type { Appointment } from "../../types/appointments";
import { getPatients } from "../../services/patientServices";
import { getAppointments } from "../../services/appointmentServices";
import { createBill } from "../../services/billingService";

const emit = defineEmits<{
  billAdded: [];
}>();
const patientId = ref("");
const appointmentId = ref("");
const amount = ref<number | null>(null);
const amount_paid = ref<number | null>(null);
const description = ref("");
const billDate = ref("");
const status = ref("Pending");
const patients = ref<Patient[]>([]);
const appointments = ref<Appointment[]>([]);
const submitting = ref(false);
const errorMessage = ref("");
async function loadFormData() {
  try {
    const [patientData, appointmentData] = await Promise.all([
      getPatients(),
      getAppointments(),
    ]);
    patients.value = patientData;
    appointments.value = appointmentData;
  } catch (error) {
    console.error("Unable to load billing options:", error);
    errorMessage.value = "Unable to load billing options.";
  }
}
async function handleSubmit() {
  errorMessage.value = "";

  if (amount.value === null) {
    errorMessage.value = "Amount is required.";
    return;
  }

  submitting.value = true;

  try {
    await createBill({
      patient_id: patientId.value || null,

      appointment_id: appointmentId.value || null,

      amount: amount.value,
      amount_paid: amount_paid.value,

      description: description.value || null,

      bill_date: billDate.value,

      status: status.value,
    });
    patientId.value = "";
    appointmentId.value = "";
    amount.value = null;
    description.value = "";
    billDate.value = "";
    status.value = "Pending";
    emit("billAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create bill.";
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
    <h2>Add Bill</h2>

    <div>
      <label for="bill-patient"> Patient </label>

      <select id="bill-patient" v-model="patientId">
        <option value="">No Patient</option>

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
      <label for="bill-appointment"> Appointment </label>

      <select id="bill-appointment" v-model="appointmentId">
        <option value="">No Appointment</option>

        <option
          v-for="appointment in appointments"
          :key="appointment.id"
          :value="appointment.id"
        >
          {{ appointment.appointment_date }}
          —
          {{ appointment.patient?.first_name }}
          {{ appointment.patient?.last_name }}
        </option>
      </select>
    </div>

    <div>
      <label for="bill-amount"> Amount </label>

      <input
        id="bill-amount"
        v-model.number="amount"
        type="number"
        min="0"
        step="0.01"
        required
      />
    </div>

    <div>
      <label for="bill-description"> Description </label>

      <textarea id="bill-description" v-model="description"></textarea>
    </div>

    <div>
      <label for="bill-date"> Bill Date </label>

      <input id="bill-date" v-model="billDate" type="date" required />
    </div>

    <div>
      <label for="bill-status"> Status </label>
      <select id="bill-status" v-model="status" required>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Overdue">Overdue</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Bill" }}
    </button>
  </form>
</template>
