<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { Staff } from "../../types/staff";

import { getStaff } from "../../services/staffServices";
import { createDepartment } from "../../services/departmentServices";
const emit = defineEmits<{
  departmentAdded: [];
}>();

const name = ref("");
const location = ref("");
const headStaffId = ref("");
const staff = ref<Staff[]>([]);
const submitting = ref(false);
const errorMessage = ref("");

async function loadStaff() {
  try {
    staff.value = await getStaff();
  } catch (error) {
    console.error("Unable to load staff for department form:", error);
  }
}
async function handleSubmit() {
  errorMessage.value = "";
  submitting.value = true;
  try {
    await createDepartment({
      name: name.value,
      location: location.value || null,
      head_staff_id: headStaffId.value || null,
    });
    name.value = "";
    location.value = "";
    headStaffId.value = "";
    emit("departmentAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create department.";
    }
  } finally {
    submitting.value = false;
  }
}
onMounted(() => {
  loadStaff();
});
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Department</h2>
    <div>
      <label for="department-name"> Department Name </label>
      <input id="department-name" v-model="name" type="text" required />
    </div>
    <div>
      <label for="department-location"> Location </label>
      <input id="department-location" v-model="location" type="text" />
    </div>
    <div>
      <label for="department-head"> Department Head </label>
      <select id="department-head" v-model="headStaffId">
        <option value="">No department head</option>
        <option v-for="member in staff" :key="member.id" :value="member.id">
          {{ member.first_name }}
          {{ member.last_name }}
          — {{ member.role }}
        </option>
      </select>
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Department" }}
    </button>
  </form>
</template>
