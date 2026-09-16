<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Department } from "../../types/department";
import { getDepartment } from "../../services/departmentServices";
import { createRoom } from "../../services/roomService";

const emit = defineEmits<{
  roomsAdded: [];
}>();

const roomNumber = ref("");
const depId = ref("");
const roomType = ref("");
const status = ref("");

const departments = ref<Department[]>([]);
const submitting = ref(false);
const errorMessage = ref("");

async function loadDepartments() {
  try {
    departments.value = await getDepartment();
  } catch (error) {
    console.error("Unable to load departments:", error);
    errorMessage.value = "Unable to load departments.";
  }
}
async function handleSubmit() {
  errorMessage.value = "";
  submitting.value = true;
  try {
    await createRoom({
      room_number: roomNumber.value,
      dep_id: depId.value || null,
      room_type: roomType.value || null,
      status: status.value,
    });
    roomNumber.value = "";
    depId.value = "";
    roomType.value = "";
    status.value = "";
    emit("roomsAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create room";
    }
  } finally {
    submitting.value = false;
  }
}
onMounted(() => {
  loadDepartments();
});
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Room</h2>
    <div>
      <label for="room-number"> Room Number </label>
      <input id="room-number" v-model="roomNumber" type="text" required />
    </div>
    <div>
      <label for="room-department"> Department </label>
      <select id="room-department" v-model="depId">
        <option value="">No Department</option>
        <option
          v-for="department in departments"
          :key="department.dep_id"
          :value="department.dep_id"
        >
          {{ department.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="room-type"> Room Type </label>

      <input
        id="room-type"
        v-model="roomType"
        type="text"
        placeholder="ICU, Exam, Operating..."
      />
    </div>
    <div>
      <label for="room-status"> Status </label>
      <select id="room-status" v-model="status" required>
        <option value="">Select Status</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>

        <option value="Cleaning">Cleaning</option>
        <option value="Maintenance">Maintenance</option>

        <option value="Reserved">Reserved</option>
      </select>
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Room" }}
    </button>
  </form>
</template>
