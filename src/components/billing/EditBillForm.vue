<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import type { Bill } from "../../types/billing";
import type { Patient } from "../../types/patient";
import type { Appointment } from "../../types/appointments";

import { getPatients } from "../../services/patientServices";
import { getAppointments } from "../../services/appointmentServices";
import { updateBill } from "../../services/billingService";
const props = defineProps<{
  bill: Bill;
}>();

const emit = defineEmits<{
  billUpdated: [];
  cancel: [];
}>();

const form = reactive({
  patient_id: props.bill.patient_id ?? "",
  appointment_id: props.bill.appointment_id ?? "",
  amount: Number(props.bill.amount),
  amount_paid: Number(props.bill.amount_paid),
  description: props.bill.description ?? "",
  bill_date: props.bill.bill_date,
  status: props.bill.status,
});

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
  if (form.amount < 0) {
    errorMessage.value = "Bill amount cannot be negative.";
    return;
  }
  if (form.amount_paid < 0) {
    errorMessage.value = "Amount paid cannot be negative.";
    return;
  }
  if (form.amount_paid > form.amount) {
    errorMessage.value = "Amount paid cannot be greater than the bill amount.";
    return;
  }

  submitting.value = true;

  try {
    await updateBill(props.bill.bill_id, {
      patient_id: form.patient_id || null,
      appointment_id: form.appointment_id || null,
      amount: form.amount,
      amount_paid: form.amount_paid,
      description: form.description || null,
      bill_date: form.bill_date,
      status: form.status,
    });

    emit("billUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to update bill.";
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
    <h2>Edit Bill</h2>

    <div>
      <label for="edit-bill-patient"> Patient </label>

      <select id="edit-bill-patient" v-model="form.patient_id">
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
      <label for="edit-bill-appointment"> Appointment </label>

      <select id="edit-bill-appointment" v-model="form.appointment_id">
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
      <label for="edit-bill-amount"> Bill Amount </label>
      <input
        id="edit-bill-amount"
        v-model.number="form.amount"
        type="number"
        min="0"
        step="0.01"
        required
      />
    </div>
    <div>
      <label for="edit-amount-paid"> Amount Paid </label>
      <input
        id="edit-amount-paid"
        v-model.number="form.amount_paid"
        type="number"
        min="0"
        step="0.01"
        required
      />
    </div>
    <div>
      <label for="edit-bill-description"> Description </label>
      <textarea
        id="edit-bill-description"
        v-model="form.description"
      ></textarea>
    </div>
    <div>
      <label for="edit-bill-date"> Bill Date </label>
      <input
        id="edit-bill-date"
        v-model="form.bill_date"
        type="date"
        required
      />
    </div>
    <div>
      <label for="edit-bill-status"> Status </label>
      <select id="edit-bill-status" v-model="form.status" required>
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
      {{ submitting ? "Saving..." : "Save Changes" }}
    </button>
    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
