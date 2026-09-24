<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Department } from "../types/department";
import {
  getDepartment,
  deleteDepartment,
} from "../services/departmentServices";
import AddDepartmentForm from "../components/departments/AddDepartmentForm.vue";
import EditDepartmentForm from "../components/departments/EditDepartmentForm.vue";
const departments = ref<Department[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedDepartment = ref<Department | null>(null);

function editDepartment(department: Department) {
  selectedDepartment.value = department;
}
async function handleDepartmentUpdated() {
  selectedDepartment.value = null;
  await loadDepartments();
}
async function loadDepartments() {
  loading.value = true;
  errorMessage.value = "";
  try {
    departments.value = await getDepartment();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load departments.";
    }
  } finally {
    loading.value = false;
  }
}
async function handleDeleteDepartment(department: Department) {
  const confirmed = window.confirm(`Delete ${department.name}?`);
  if (!confirmed) {
    return;
  }
  try {
    await deleteDepartment(department.dep_id);
    await loadDepartments();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete department.";
    }
  }
}
onMounted(() => {
  loadDepartments();
});
</script>

<template>
  <section>
    <h1>Departments</h1>
    <AddDepartmentForm @department-added="loadDepartments" />
    <EditDepartmentForm
      v-if="selectedDepartment"
      :department="selectedDepartment"
      @department-updated="handleDepartmentUpdated"
      @cancel="selectedDepartment = null"
    />
    <p v-if="loading">Loading departments...</p>
    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p v-else-if="departments.length === 0">No departments found.</p>
    <div v-else>
      <div v-for="department in departments" :key="department.dep_id">
        <h3>
          {{ department.name }}
        </h3>
        <p>
          Location:
          {{ department.location ?? "Not assigned" }}
        </p>
        <p>
          Department Head:
          <span v-if="department.head_staff">
            {{ department.head_staff.first_name }}
            {{ department.head_staff.last_name }}
            — {{ department.head_staff.role }}
          </span>

          <span v-else> Not assigned </span>
        </p>
        <button @click="editDepartment(department)">Edit</button>
        <button @click="handleDeleteDepartment(department)">Delete</button>
      </div>
    </div>
  </section>
</template>
<style scoped>
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
