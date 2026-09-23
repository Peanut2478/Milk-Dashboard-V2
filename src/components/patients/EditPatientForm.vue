<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import type { Insurance } from "../../types/insurance";
import {
  getInsuranceByPatient,
  createInsurance,
  updateInsurance,
} from "../../services/insuranceService";
import type { Patient } from "../../types/patient";
import { updatePatient } from "../../services/patientServices";
const props = defineProps<{
  patient: Patient;
}>();

const emit = defineEmits<{
  patientUpdated: [];
  cancel: [];
}>();
const existingInsurance = ref<Insurance | null>(null);

const insuranceProvider = ref("");
const policyNumber = ref("");
const groupNumber = ref("");
const coverageStart = ref("");
const coverageEnd = ref("");
const insuranceStatus = ref("Active");

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
async function loadInsurance() {
  try {
    const records = await getInsuranceByPatient(props.patient.id);

    if (records.length > 0) {
      existingInsurance.value = records[0];
      insuranceProvider.value = records[0].provider_name;
      policyNumber.value = records[0].policy_number;
      groupNumber.value = records[0].group_number;
      coverageStart.value = records[0].coverage_start ?? "";
      coverageEnd.value = records[0].coverage_end ?? "";
      insuranceStatus.value = records[0].status;
    }
  } catch (error) {
    console.error("Failed to load insurance:", error);
  }
}
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
    if (insuranceProvider.value && policyNumber.value && groupNumber.value) {
      const insuranceData = {
        patient_id: props.patient.id,
        provider_name: insuranceProvider.value,
        policy_number: policyNumber.value,
        group_number: groupNumber.value,
        coverage_start: coverageStart.value || null,
        coverage_end: coverageEnd.value || null,
        status: insuranceStatus.value,
      };
      if (existingInsurance.value) {
        await updateInsurance(
          existingInsurance.value.insurance_id,
          insuranceData,
        );
      } else {
        await createInsurance(insuranceData);
      }
    }
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
onMounted(() => {
  loadInsurance();
});
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
    <h3>Insurance</h3>
    <div>
      <label>Provider</label>
      <input v-model="insuranceProvider" placeholder="Blue Cross Blue Shield" />
    </div>
    <div>
      <label>Policy Number</label>
      <input v-model="policyNumber" />
    </div>
    <div>
      <label>Group Number</label>
      <input v-model="groupNumber" />
    </div>

    <div>
      <label>Coverage Start</label>
      <input v-model="coverageStart" type="date" />
    </div>

    <div>
      <label>Coverage End</label>
      <input v-model="coverageEnd" type="date" />
    </div>
    <div>
      <label>Insurance Status</label>
      <select v-model="insuranceStatus">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Expired">Expired</option>
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
