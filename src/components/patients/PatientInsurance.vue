<script setup lang="ts">
import { ref } from "vue";
import type { Insurance, NewInsurance } from "../../types/insurance";
import {
  getInsuranceByPatient,
  createInsurance,
  deleteInsurance,
} from "../../services/insuranceService";
const props = defineProps<{
  patientId: string;
}>();
const insuranceRecods = ref<Insurance[]>([]);
const expanded = ref(false);
const showForm = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const providerName = ref("");
const policyNumber = ref("");
const groupNumber = ref("");
const coverageStart = ref("");
const coverageEnd = ref("");
const status = ref("Active");
async function toggleInsurance() {
  expanded.value = !expanded.value;
  if (expanded.value && insuranceRecods.value.length === 0) {
    await loadInsurance();
  }
}
async function loadInsurance() {
  loading.value = true;
  errorMessage.value = "";
  try {
    insuranceRecods.value = await getInsuranceByPatient(props.patientId);
  } catch (error) {
    console.error(error);
    errorMessage.value = "Could notrr load insurance";
  } finally {
    loading.value = false;
  }
}
async function handleSubmit() {
  errorMessage.value = "";

  if (
    !providerName.value ||
    !policyNumber.value ||
    !groupNumber.value ||
    !status.value
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  const newInsurance: NewInsurance = {
    patient_id: props.patientId,
    provider_name: providerName.value,
    policy_number: policyNumber.value,
    group_number: groupNumber.value,
    coverage_start: coverageStart.value || null,
    coverage_end: coverageEnd.value || null,
    status: status.value,
  };

  try {
    await createInsurance(newInsurance);
    resetForm();
    await loadInsurance();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Could not create insurance.";
  }
}

async function handleDelete(insuranceId: string) {
  const confirmed = window.confirm("Delete this insurance record?");
  if (!confirmed) {
    return;
  }
  try {
    await deleteInsurance(insuranceId);
    await loadInsurance();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Could not delete insurance.";
  }
}

function resetForm() {
  providerName.value = "";
  policyNumber.value = "";
  groupNumber.value = "";
  coverageStart.value = "";
  coverageEnd.value = "";
  status.value = "Active";
  showForm.value = false;
}
</script>
<template>
  <div class="insurance-section">
    <button type="button" @click="toggleInsurance">
      {{ expanded ? "Hide Insurance" : "View Insurance" }}
    </button>

    <div v-if="expanded">
      <p v-if="loading">Loading insurance...</p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <template v-if="!loading">
        <p v-if="insuranceRecods.length === 0">No insurance on file.</p>

        <div
          v-for="insurance in insuranceRecods"
          :key="insurance.insurance_id"
          class="insurance-card"
        >
          <strong>
            {{ insurance.provider_name }}
          </strong>

          <p>
            Policy:
            {{ insurance.policy_number }}
          </p>

          <p>
            Group:
            {{ insurance.group_number }}
          </p>

          <p>
            Coverage:
            {{ insurance.coverage_start || "N/A" }}
            -
            {{ insurance.coverage_end || "Ongoing" }}
          </p>

          <p>
            Status:
            {{ insurance.status }}
          </p>

          <button type="button" @click="handleDelete(insurance.insurance_id)">
            Delete Insurance
          </button>
        </div>

        <button v-if="!showForm" type="button" @click="showForm = true">
          Add Insurance
        </button>

        <form v-if="showForm" @submit.prevent="handleSubmit">
          <div>
            <label> Provider </label>

            <input v-model="providerName" required />
          </div>

          <div>
            <label> Policy Number </label>

            <input v-model="policyNumber" required />
          </div>

          <div>
            <label> Group Number </label>

            <input v-model="groupNumber" required />
          </div>

          <div>
            <label> Coverage Start </label>

            <input v-model="coverageStart" type="date" />
          </div>

          <div>
            <label> Coverage End </label>

            <input v-model="coverageEnd" type="date" />
          </div>

          <div>
            <label> Status </label>

            <select v-model="status" required>
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>

              <option value="Expired">Expired</option>
            </select>
          </div>

          <button type="submit">Save Insurance</button>

          <button type="button" @click="resetForm">Cancel</button>
        </form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.insurance-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
.insurance-card {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}
</style>
