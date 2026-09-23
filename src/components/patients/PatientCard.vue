<script setup lang="ts">
import type { Patient } from "../../types/patient";
import PatientInsurance from "./PatientInsurance.vue";
defineProps<{
  patient: Patient;
}>();

const emit = defineEmits<{
  edit: [patient: Patient];
  delete: [patient: Patient];
}>();
</script>

<template>
  <article class="patient-card">
    <h3>
      {{ patient.first_name }}
      {{ patient.last_name }}
    </h3>
    <p>Age: {{ patient.age }}</p>
    <p>{{ patient.email ?? "No email" }}</p>
    <p>{{ patient.phone ?? "No phone" }}</p>
    <div class="actions">
      <button @click="emit('edit', patient)">Edit</button>
      <button @click="emit('delete', patient)">Delete</button>
    </div>
    <PatientInsurance :patient-id="patient.id" />
  </article>
</template>

<style scoped>
.patient-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
