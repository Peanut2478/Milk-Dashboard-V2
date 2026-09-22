<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { Patient } from "../types/patient";
import { getPatients, deletePatient } from "../services/patientServices";
import AddPatientForm from "../components/patients/AddPatientForm.vue";
import EditPatientForm from "../components/patients/EditPatientForm.vue";
import PatientCard from "../components/patients/PatientCard.vue";
const patients = ref<Patient[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedPatient = ref<Patient | null>(null);

function editPatient(patient: Patient) {
  selectedPatient.value = patient;
}
async function handlePatientUpdate() {
  selectedPatient.value = null;
  await loadPatients();
}
async function loadPatients() {
  loading.value = true;
  errorMessage.value = "";

  try {
    patients.value = await getPatients();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load patients.";
    }
  } finally {
    loading.value = false;
  }
}
async function handleDelete(patient: Patient) {
  const confirmed = window.confirm(
    `Delete ${patient.first_name} ${patient.last_name}?`,
  );
  if (!confirmed) {
    return;
  }
  try {
    await deletePatient(patient.id);
    await loadPatients();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete patient.";
    }
  }
}

const searchTerm = ref("");
const filteredPatients = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  if (!search) {
    return patients.value;
  }
  return patients.value.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const email = patient.email?.toLowerCase() ?? "";
    const phone = patient.phone?.toLowerCase() ?? "";
    return (
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search)
    );
  });
});
onMounted(() => {
  loadPatients();
});
</script>

<template>
  <section>
    <h1>Patients</h1>
    <AddPatientForm @patient-added="loadPatients" />
    <EditPatientForm
      v-if="selectedPatient"
      :patient="selectedPatient"
      @patient-updated="handlePatientUpdate"
      @cancel="selectedPatient = null"
    />
    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search patients..."
      />
    </div>
    <p v-if="loading">Loading patients...</p>

    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>

    <p v-else-if="patients.length === 0">No patients found.</p>
    <p v-if="!loading && patients.length > 0 && filteredPatients.length === 0">
      No patients match your search.
    </p>

    <div v-else class="patient-list">
      <PatientCard
        v-for="patient in filteredPatients"
        :key="patient.id"
        :patient="patient"
        @edit="editPatient"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
