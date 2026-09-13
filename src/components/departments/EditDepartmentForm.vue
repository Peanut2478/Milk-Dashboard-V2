<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import type { Department } from "../../types/department";
import type { Staff } from "../../types/staff";

import { getStaff } from "../../services/staffServices";
import { updateDepartment } from "../../services/departmentServices";
const props = defineProps<{
  department: Department;
}>();

const emit = defineEmits<{
  departmentUpdated: [];
  cancel: [];
}>();

const form = reactive({
  name: props.department.name,
  location: props.department.location ?? "",
  head_staff_id: props.department.head_staff_id ?? "",
});

const staff = ref<Staff[]>([]);
const submitting = ref(false);
const errorMessage = ref("");

async function loadStaff() {
  try {
    staff.value = await getStaff();
  } catch (error) {
    console.error("Unable to load staff:", error);
  }
}

async function handleSubmit() {
  errorMessage.value = "";
  if (!props.department.dep_id) {
    errorMessage.value = "Department ID is missing.";
    console.error("Department has no ID:", props.department);
    return;
  }
  submitting.value = true;
  try {
    await updateDepartment(props.department.dep_id, {
      name: form.name,
      location: form.location || null,
      head_staff_id: form.head_staff_id || null,
    });

    emit("departmentUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to update department.";
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
    <h2>Edit Department</h2>

    <div>
      <label for="edit-department-name"> Department Name </label>

      <input
        id="edit-department-name"
        v-model="form.name"
        type="text"
        required
      />
    </div>

    <div>
      <label for="edit-department-location"> Location </label>

      <input
        id="edit-department-location"
        v-model="form.location"
        type="text"
      />
    </div>

    <div>
      <label for="edit-department-head"> Department Head </label>

      <select id="edit-department-head" v-model="form.head_staff_id">
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
      {{ submitting ? "Saving..." : "Save Changes" }}
    </button>

    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
