<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Admission } from "../types/admissions";
import type { Patient } from "../types/patient";
import type { Room } from "../types/rooms";
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from "../services/admissionService";
import { getPatients } from "../services/patientServices";
import { getRooms } from "../services/roomService";

const admissions = ref<Admission[]>([]);
const patients = ref<Patient[]>([]);
const rooms = ref<Room[]>([]);
const selectedPatient = ref("");
const selectedRoom = ref("");
const admissionDate = ref(getLocalDateTime());
const reason = ref("");
const selectedStatus = ref("");
const searchTerm = ref("");
const loading = ref(false);
const errorMessage = ref("");
function getLocalDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
async function loadData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [admissionData, patientData, roomData] = await Promise.all([
      getAdmissions(),
      getPatients(),
      getRooms(),
    ]);
    admissions.value = admissionData;
    patients.value = patientData;
    rooms.value = roomData;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to load admissions.";
  } finally {
    loading.value = false;
  }
}
const availableRooms = computed(() =>
  rooms.value.filter((room) => room.status === "Available"),
);
const filteredAdmissions = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return admissions.value.filter((admission) => {
    const patientName = admission.patient
      ? `${admission.patient.first_name} ${admission.patient.last_name}`.toLowerCase()
      : "";
    const matchesSearch =
      !search ||
      patientName.includes(search) ||
      admission.reason?.toLowerCase().includes(search);
    const matchesStatus =
      !selectedStatus.value || admission.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});
async function handleAdmission() {
  errorMessage.value = "";
  if (!selectedPatient.value || !selectedRoom.value) {
    errorMessage.value = "Please selet qa patient an droom ";
    return;
  }
  try {
    await createAdmission({
      patient_id: selectedPatient.value,
      room_id: selectedRoom.value,
      admission_date: admissionDate.value,
      discharge_date: null,
      reason: reason.value || null,
      status: "Admitted",
    });
    selectedPatient.value = "";
    selectedRoom.value = "";
    reason.value = "";
    admissionDate.value = getLocalDateTime();
    await loadData();
  } catch (error) {
    console.error(error);
    errorMessage.value = "failed to admit patientr";
  }
}
async function dischargePatient(admission: Admission) {
  const confirmed = window.confirm("Discharge this patient?");

  if (!confirmed) {
    return;
  }
  try {
    await updateAdmission(admission.admission_id, {
      status: "Discharged",
      discharge_date: getLocalDateTime(),
    });
    await loadData();
  } catch (error) {
    console.error(error);

    errorMessage.value = "Failed to discharge patient.";
  }
}
async function cancelAdmission(admission: Admission) {
  try {
    await updateAdmission(admission.admission_id, {
      status: "Cancelled",
    });
    await loadData();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to cancel admission.";
  }
}

async function handleDelete(admission: Admission) {
  const confirmed = window.confirm("Delete this admission record?");
  if (!confirmed) {
    return;
  }
  try {
    await deleteAdmission(admission.admission_id);
    await loadData();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to delete admission.";
  }
}

onMounted(loadData);
</script>
<template>
  <div>
    <h1>Admissions</h1>
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
    <form @submit.prevent="handleAdmission">
      <h2>Admit Patient</h2>
      <div>
        <label>Patient</label>
        <select v-model="selectedPatient" required>
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
        <label>Room</label>
        <select v-model="selectedRoom" required>
          <option value="">Select Available Room</option>
          <option
            v-for="room in availableRooms"
            :key="room.room_id"
            :value="room.room_id"
          >
            Room
            {{ room.room_number }}
            -
            {{ room.room_type ?? "General" }}
          </option>
        </select>
      </div>
      <div>
        <label> Admission Date </label>
        <input v-model="admissionDate" type="datetime-local" required />
      </div>
      <div>
        <label>Reason</label>
        <textarea v-model="reason" placeholder="Reason for admission..." />
      </div>
      <button type="submit">Admit Patient</button>
    </form>

    <div class="admission-filters">
      <input v-model="searchTerm" placeholder="Search patient or reason..." />
      <select v-model="selectedStatus">
        <option value="">All Statuses</option>
        <option value="Admitted">Admitted</option>
        <option value="Discharged">Discharged</option>
        <option value="Transferred">Transferred</option>
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
    <p v-if="loading">Loading admissions...</p>
    <p v-else-if="filteredAdmissions.length === 0">No admissions found.</p>
    <article
      v-for="admission in filteredAdmissions"
      :key="admission.admission_id"
    >
      <h3>
        {{
          admission.patient
            ? `${admission.patient.first_name} ${admission.patient.last_name}`
            : "Unknown Patient"
        }}
      </h3>
      <p>
        Room:
        {{ admission.room?.room_number ?? "None" }}
      </p>
      <p>
        Reason:
        {{ admission.reason ?? "Not provided" }}
      </p>
      <p>
        Admitted:
        {{ new Date(admission.admission_date).toLocaleString() }}
      </p>
      <p v-if="admission.discharge_date">
        Discharged:
        {{ new Date(admission.discharge_date).toLocaleString() }}
      </p>
      <p>
        Status:
        <span class="status-badge" :class="admission.status.toLowerCase()">
          {{ admission.status }}
        </span>
      </p>
      <button
        v-if="admission.status === 'Admitted'"
        type="button"
        @click="dischargePatient(admission)"
      >
        Discharge
      </button>
      <button
        v-if="admission.status === 'Admitted'"
        type="button"
        @click="cancelAdmission(admission)"
      >
        Cancel Admission
      </button>
      <button type="button" @click="handleDelete(admission)">Delete</button>
    </article>
  </div>
</template>

<style scoped>
.admission-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.admission-filters input,
.admission-filters select {
  width: auto;
  min-width: 180px;
}
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
}
.admitted {
  background: #dcfce7;
}
.discharged {
  background: #dbeafe;
}
.transferred {
  background: #fef3c7;
}
.cancelled {
  background: #e5e7eb;
}
</style>
