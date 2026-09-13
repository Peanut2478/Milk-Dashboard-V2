<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Staff } from "../types/staff";
import { getStaff, deleteStaff } from "../services/staffServices";
import StaffCard from "../components/staff/staffCard.vue";
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

onMounted(() => {
  loadStaff();
});
</script>

<template>
  <section>
    <h1>Staff</h1>
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
        v-for="member in staff"
        :key="member.id"
        :member="member"
        @edit="editStaff"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
