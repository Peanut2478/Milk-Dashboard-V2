<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { Staff } from "../types/staff";
import { getStaff, deleteStaff } from "../services/staffServices";
import StaffCard from "../components/staff/StaffCard.vue";
import EditStaffForm from "../components/staff/EditStaffForm.vue";
import AddStaffForm from "../components/staff/AddStaffForm.vue";
const staff = ref<Staff[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedStaff = ref<Staff | null>(null);

function editStaff(member: Staff) {
  selectedStaff.value = member;
}

async function handleStaffUpdated() {
  selectedStaff.value = null;
  await loadStaff();
}
async function handleDelete(member: Staff) {
  const confirmed = window.confirm(
    `Delete ${member.first_name} ${member.last_name}?`,
  );
  if (!confirmed) {
    return;
  }
  try {
    await deleteStaff(member.id);
    await loadStaff();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete staff member.";
    }
  }
}

async function loadStaff() {
  loading.value = true;
  errorMessage.value = "";
  try {
    staff.value = await getStaff();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load staff.";
    }
  } finally {
    loading.value = false;
  }
}
const searchTerm = ref("");
const selectedRole = ref("");
const filteredStaff = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return staff.value.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      member.email.toLowerCase().includes(search);
    const matchesRole =
      !selectedRole.value || member.role === selectedRole.value;
    return matchesSearch && matchesRole;
  });
});
onMounted(() => {
  loadStaff();
});
</script>

<template>
  <section>
    <h1>Staff</h1>
    <input v-model="searchTerm" type="text" placeholder="Search staff..." />

    <select v-model="selectedRole">
      <option value="">All Roles</option>
      <option value="Admin">Admin</option>
      <option value="Doctor">Doctor</option>
      <option value="Nurse">Nurse</option>
      <option value="Reception">Reception</option>
      <option value="Billing">Billing</option>
      <option value="Pharmacist">Pharmacist</option>
      <option value="Supply Manager">Supply Manager</option>
      <option value="Technician">Technician</option>
    </select>
    <EditStaffForm
      v-if="selectedStaff"
      :member="selectedStaff"
      @staff-updated="handleStaffUpdated"
      @cancel="selectedStaff = null"
    />
    <AddStaffForm @staff-added="loadStaff" />
    <p v-if="loading">Loading staff...</p>

    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>

    <p v-else-if="staff.length === 0">No staff members found.</p>

    <div v-else class="staff-list">
      <StaffCard
        v-for="member in filteredStaff"
        :key="member.id"
        :member="member"
        @edit="editStaff"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
