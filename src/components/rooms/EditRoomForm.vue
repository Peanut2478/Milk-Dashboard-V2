<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Room } from "../../types/rooms";
import type { Department } from "../../types/department";
import { getDepartment } from "../../services/departmentServices";
import { updateRoom } from "../../services/roomService";

const props = defineProps<{
  room: Room;
}>();
const emit = defineEmits<{
  roomUpdated: [];
  cancel: [];
}>();

const form = reactive({
  room_number: props.room.room_number,
  dep_id: props.room.dep_id,
  room_type: props.room.room_type,
  status: props.room.status,
});
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
    await updateRoom(props.room.room_id, {
      room_number: form.room_number,
      dep_id: form.dep_id || null,
      room_type: form.room_type || null,
      status: form.status,
    });
    emit("roomUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Room canr be updated";
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
    <h2>Edit Room</h2>
    <div>
      <label for="edit-room-number"> Room Number </label>
      <input
        id="edit-room-number"
        v-model="form.room_number"
        type="text"
        required
      />
    </div>
    <div>
      <label for="edit-room-department"> Department </label>
      <select id="edit-room-department" v-model="form.dep_id">
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
      <label for="edit-room-type"> Room Type </label>
      <input id="edit-room-type" v-model="form.room_type" type="text" />
    </div>
    <div>
      <label for="edit-room-status"> Status </label>
      <select id="edit-room-status" v-model="form.status" required>
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
      {{ submitting ? "Saving..." : "Save Changes" }}
    </button>
    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
