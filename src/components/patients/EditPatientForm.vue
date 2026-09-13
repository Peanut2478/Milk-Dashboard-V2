<script setup lang="ts">
import { reactive, ref } from "vue";

import type { Patient } from "../../types/patient";
import { updatePatient } from "../../services/patientServices";
const props = defineProps<{
  patient: Patient;
}>();

const emit = defineEmits<{
  patientUpdated: [];
  cancel: [];
}>();

const form = reactive({
  first_name: props.patient.first_name,
  last_name: props.patient.last_name,
  date_of_birth: props.patient.date_of_birth,
  age: props.patient.age,
  gender: props.patient.gender ?? "",
  phone: props.patient.phone ?? "",
  email: props.patient.email ?? "",
  address: props.patient.address ?? "",
  emergency_contact: props.patient.emergency_contact ?? "",
});

const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";

  try {
    await updatePatient(props.patient.id, {
      first_name: form.first_name,
      last_name: form.last_name,
      date_of_birth: form.date_of_birth,
      age: form.age,
      gender: form.gender || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      emergency_contact: form.emergency_contact || null,
    });

    emit("patientUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to update patient.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Edit Patient</h2>

    <div>
      <label for="edit-first-name">First Name</label>

      <input
        id="edit-first-name"
        v-model="form.first_name"
        type="text"
        required
      />
    </div>

    <div>
      <label for="edit-last-name">Last Name</label>

      <input
        id="edit-last-name"
        v-model="form.last_name"
        type="text"
        required
      />
    </div>

    <div>
      <label for="edit-dob">Date of Birth</label>

      <input id="edit-dob" v-model="form.date_of_birth" type="date" required />
    </div>

    <div>
      <label for="edit-age">Age</label>

      <input
        id="edit-age"
        v-model.number="form.age"
        type="number"
        min="0"
        required
      />
    </div>

    <div>
      <label for="edit-gender">Gender</label>

      <select id="edit-gender" v-model="form.gender">
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label for="edit-phone">Phone</label>

      <input id="edit-phone" v-model="form.phone" type="tel" />
    </div>

    <div>
      <label for="edit-email">Email</label>

      <input id="edit-email" v-model="form.email" type="email" />
    </div>

    <div>
      <label for="edit-address">Address</label>

      <input id="edit-address" v-model="form.address" type="text" />
    </div>

    <div>
      <label for="edit-emergency-contact"> Emergency Contact </label>

      <input
        id="edit-emergency-contact"
        v-model="form.emergency_contact"
        type="text"
      />
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
