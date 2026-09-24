<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { Room } from "../types/rooms";
import { getRooms, deleteRoom } from "../services/roomService";
import AddRoomForm from "../components/rooms/AddRoomForm.vue";
import EditRoomForm from "../components/rooms/EditRoomForm.vue";
import type { Department } from "../types/department";
import { getDepartment } from "../services/departmentServices";

const departments = ref<Department[]>([]);
const rooms = ref<Room[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedRoom = ref<Room | null>(null);
function editRoom(room: Room) {
  selectedRoom.value = room;
}
async function loadDepartments() {
  departments.value = await getDepartment();
}
async function handleRoomUpdated() {
  ((selectedRoom.value = null), await loadRooms());
}
async function handleDeleteRoom(room: Room) {
  const confirmed = window.confirm(`Delete room ${room.room_number}?`);
  if (!confirmed) {
    return;
  }
  try {
    await deleteRoom(room.room_id);
    await loadRooms();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = "Unable to delete room";
    }
  }
}
async function loadRooms() {
  loading.value = true;
  errorMessage.value = "";

  try {
    rooms.value = await getRooms();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to laod rooms";
    }
  } finally {
    loading.value = false;
  }
}

const selectedStatus = ref("");
const selectedDepartment = ref("");
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const matchesStatus =
      !selectedStatus.value || room.status === selectedStatus.value;
    const matchesDepartment =
      !selectedDepartment.value || room.dep_id === selectedDepartment.value;
    return matchesStatus && matchesDepartment;
  });
});
onMounted(async () => {
  await Promise.all([loadRooms(), loadDepartments()]);
});
</script>
<template>
  <section>
    <h1>Rooms</h1>
    <div class="room-filters">
      <select v-model="selectedStatus">
        <option value="">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
        <option value="Cleaning">Cleaning</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Reserved">Reserved</option>
      </select>

      <select v-model="selectedDepartment">
        <option value="">All Departments</option>
        <option
          v-for="department in departments"
          :key="department.dep_id"
          :value="department.dep_id"
        >
          {{ department.name }}
        </option>
      </select>

      <button
        type="button"
        @click="
          selectedStatus = '';
          selectedDepartment = '';
        "
      >
        Clear Filters
      </button>
    </div>
    <AddRoomForm @rooms-added="loadRooms" />
    <EditRoomForm
      v-if="selectedRoom"
      :room="selectedRoom"
      @room-updated="handleRoomUpdated"
      @cancel="selectedRoom = null"
    />
    <p v-if="loading">Loading rooms....</p>
    <p v-else-if="rooms.length == 0">No rooms found</p>
    <div v-else>
      <article v-for="room in filteredRooms" :key="room.room_id">
        <h3>Room{{ room.room_number }}</h3>
        <p>
          Department:
          {{ room.department?.name ?? "Not assigned" }}
        </p>
        <p>
          Type:
          {{ room.room_type ?? "Not specified" }}
        </p>
        <span
          class="status-badge"
          :class="room.status.toLowerCase().replace(' ', '-')"
        >
          {{ room.status }}
        </span>
        <button @click="editRoom(room)">Edit</button>
        <button @click="handleDeleteRoom(room)">Delete</button>
      </article>
    </div>
  </section>
</template>
<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}
.available {
  background: #dcfce7;
}
.occupied {
  background: #fee2e2;
}
.cleaning {
  background: #fef3c7;
}
.maintenance {
  background: #e5e7eb;
}
.reserved {
  background: #dbeafe;
}
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
