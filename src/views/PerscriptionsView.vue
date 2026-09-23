<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Perscription, NewPerscription } from "../types/perscriptions";
import type { Patient } from "../types/patient";
import type { Staff } from "../types/staff";
import type { Medication } from "../types/medications";
import {
  getPerscription,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../services/perscriptionService";
import { getPatients } from "../services/patientServices";
import { getStaff } from "../services/staffServices";
import { getMedications } from "../services/medicationService";

const prescriptions = ref<Perscription[]>([]);
const patients = ref<Patient[]>([]);
const staff = ref<Staff[]>([]);
const medications = ref<Medication[]>([]);
const editingPrescription = ref<Perscription | null>(null);
const patientId = ref("");
const staffId = ref("");
const medicationId = ref("");
const dosage = ref("");
const frequency = ref("");
const duration = ref("");
const prescribedDate = ref(new Date().toISOString().split("T")[0]);
const status = ref("Active");
const searchTerm = ref("");
const selectedStatus = ref("");
const loading = ref(false);
const errorMessage = ref("");
const doctors = computed(() =>
  staff.value.filter((member) => member.role === "Doctor"),
);
const filteredPrescriptions = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return prescriptions.value.filter((prescription) => {
    const patientName = prescription.patient
      ? `${prescription.patient.first_name} ${prescription.patient.last_name}`.toLowerCase()
      : "";
    const medicationName = prescription.medication?.name.toLowerCase() ?? "";
    const matchesSearch =
      !search ||
      patientName.includes(search) ||
      medicationName.includes(search);
    const matchesStatus =
      !selectedStatus.value || prescription.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});
async function loadData() {
  loading.value = true;
  errorMessage.value = "";

  try {
    patients.value = await getPatients();
    staff.value = await getStaff();
    medications.value = await getMedications();
    prescriptions.value = await getPerscription();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to load prescription data.";
  } finally {
    loading.value = false;
  }
}
async function handleSubmit() {
  errorMessage.value = "";

  if (
    !patientId.value ||
    !staffId.value ||
    !medicationId.value ||
    !dosage.value ||
    !frequency.value
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }
  const prescriptionData: NewPerscription = {
    patient_id: patientId.value,
    staff_id: staffId.value,
    medication_id: medicationId.value,
    dosage: dosage.value,
    frequency: frequency.value,
    duration: duration.value || null,
    prescribed_date: prescribedDate.value,
    status: status.value,
  };
  try {
    if (editingPrescription.value) {
      await updatePrescription(
        editingPrescription.value.prescription_id,
        prescriptionData,
      );
    } else {
      await createPrescription(prescriptionData);
    }
    resetForm();
    await loadData();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to save prescription.";
  }
}
function startEdit(perscription: Perscription) {
  editingPrescription.value = perscription;
  patientId.value = perscription.patient_id ?? "";
  staffId.value = perscription.staff_id ?? "";
  medicationId.value = perscription.medication_id ?? "";
  dosage.value = perscription.dosage;
  frequency.value = perscription.frequency;
  duration.value = perscription.duration ?? "";
  prescribedDate.value = perscription.prescribed_date;
  status.value = perscription.status;
}
function resetForm() {
  editingPrescription.value = null;
  patientId.value = "";
  staffId.value = "";
  medicationId.value = "";
  dosage.value = "";
  frequency.value = "";
  duration.value = "";
  prescribedDate.value = new Date().toISOString().split("T")[0];
  status.value = "Active";
}
async function handleDelete(prescription: Perscription) {
  const confirmed = window.confirm("Delete this prescription?");
  if (!confirmed) {
    return;
  }
  try {
    await deletePrescription(prescription.prescription_id);
    await loadData();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to delete prescription.";
  }
}
onMounted(loadData);
</script>
<template>
  <div>
    <h1>Prescriptions</h1>
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
    <form @submit.prevent="handleSubmit">
      <h2>
        {{ editingPrescription ? "Edit Prescription" : "New Prescription" }}
      </h2>
      <div>
        <label>Patient</label>
        <select v-model="patientId" required>
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
        <label>Prescribing Doctor</label>
        <select v-model="staffId" required>
          <option value="">Select Doctor</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.first_name }}
            {{ doctor.last_name }}
          </option>
        </select>
      </div>
      <div>
        <label>Medication</label>

        <select v-model="medicationId" required>
          <option value="">Select Medication</option>
          <option
            v-for="medication in medications"
            :key="medication.medication_id"
            :value="medication.medication_id"
          >
            {{ medication.name }}
            {{ medication.strength ?? "" }}
          </option>
        </select>
      </div>
      <div>
        <label>Dosage</label>
        <input v-model="dosage" placeholder="500 mg" required />
      </div>
      <div>
        <label>Frequency</label>
        <input v-model="frequency" placeholder="Twice daily" required />
      </div>
      <div>
        <label>Duration</label>
        <input v-model="duration" placeholder="7 days" />
      </div>
      <div>
        <label> Prescribed Date </label>
        <input v-model="prescribedDate" type="date" required />
      </div>
      <div>
        <label>Status</label>
        <select v-model="status">
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit">
        {{ editingPrescription ? "Save Changes" : "Create Prescription" }}
      </button>
      <button v-if="editingPrescription" type="button" @click="resetForm">
        Cancel
      </button>
    </form>
    <div class="prescription-filters">
      <input
        v-model="searchTerm"
        placeholder="Search patient or medication..."
      />
      <select v-model="selectedStatus">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <button
        type="button"
        @click="
          searchTerm = '';
          selectedStatus = '';
        "
      >
        Clear Filters
      </button>
    </div>
    <p v-if="loading">Loading prescriptions...</p>
    <p v-else-if="filteredPrescriptions.length === 0">
      No prescriptions found.
    </p>
    <article
      v-for="prescription in filteredPrescriptions"
      :key="prescription.prescription_id"
    >
      <h3>
        {{
          prescription.patient
            ? `${prescription.patient.first_name} ${prescription.patient.last_name}`
            : "Unknown Patient"
        }}
      </h3>
      <p>
        Medication:
        {{ prescription.medication?.name ?? "Unknown" }}
        {{ prescription.medication?.strength ?? "" }}
      </p>
      <p>
        Prescribed By:
        {{
          prescription.staff_member
            ? `${prescription.staff_member.first_name} ${prescription.staff_member.last_name}`
            : "Unknown"
        }}
      </p>
      <p>
        Dosage:
        {{ prescription.dosage }}
      </p>
      <p>
        Frequency:
        {{ prescription.frequency }}
      </p>
      <p>
        Duration:
        {{ prescription.duration ?? "Not specified" }}
      </p>
      <p>
        Date:
        {{ prescription.prescribed_date }}
      </p>
      <p>
        Status:
        {{ prescription.status }}
      </p>

      <button type="button" @click="startEdit(prescription)">Edit</button>
      <button type="button" @click="handleDelete(prescription)">Delete</button>
    </article>
  </div>
</template>

<style scoped>
.prescription-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.prescription-filters input,
.prescription-filters select {
  width: auto;
  min-width: 180px;
}
input,
select,
textarea {
  color: #1f2937;
  background-color: white;
}
input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}
</style>
