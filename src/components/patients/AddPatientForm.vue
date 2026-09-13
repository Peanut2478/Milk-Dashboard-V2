<script setup lang="ts">
import { ref } from "vue";

import { createPatient } from "../../services/patientServices";
const emit = defineEmits<{
  patientAdded: [];
}>();

const firstName = ref("");
const lastName = ref("");
const dateOfBirth = ref("");
const age = ref();
const gender = ref("");
const phone = ref("");
const email = ref("");
const address = ref("");
const emergencyContact = ref("");

const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";

  try {
    await createPatient({
      first_name: firstName.value,
      last_name: lastName.value,
      date_of_birth: dateOfBirth.value,
      age: age.value,
      gender: gender.value || null,
      phone: phone.value || null,
      email: email.value || null,
      address: address.value || null,
      emergency_contact: emergencyContact.value || null,
    });

    firstName.value = "";
    lastName.value = "";
    dateOfBirth.value = "";
    age.value = "";
    gender.value = "";
    phone.value = "";
    email.value = "";
    address.value = "";
    emergencyContact.value = "";

    emit("patientAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to add patient.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Patient</h2>

    <div>
      <label for="first-name">First Name</label>

      <input id="first-name" v-model="firstName" type="text" required />
    </div>

    <div>
      <label for="last-name">Last Name</label>

      <input id="last-name" v-model="lastName" type="text" required />
    </div>

    <div>
      <label for="dob">Date of Birth</label>

      <input id="dob" v-model="dateOfBirth" type="date" />
    </div>
    <div>
      <label for="age">Age</label>
      <input id="age" v-model="age" type="integer" />
    </div>
    <div>
      <label for="gender">Gender</label>

      <select id="gender" v-model="gender">
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label for="phone">Phone</label>

      <input id="phone" v-model="phone" type="tel" />
    </div>

    <div>
      <label for="email">Email</label>

      <input id="email" v-model="email" type="email" />
    </div>

    <div>
      <label for="address">Address</label>

      <input id="address" v-model="address" type="text" />
    </div>

    <div>
      <label for="emergency-contact"> Emergency Contact </label>

      <input id="emergency-contact" v-model="emergencyContact" type="text" />
    </div>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <button type="submit" :disabled="submitting">
      {{ submitting ? "Adding..." : "Add Patient" }}
    </button>
  </form>
</template>
