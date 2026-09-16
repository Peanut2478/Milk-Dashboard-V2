<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Room } from "../types/rooms";
import { getRooms, deleteRoom } from "../services/roomService";
import AddRoomForm from "../components/rooms/AddRoomForm.vue";
import EditRoomForm from "../components/rooms/EditRoomForm.vue";
const rooms = ref<Room[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedRoom = ref<Room | null>(null);
function editRoom(room: Room) {
  selectedRoom.value = room;
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
onMounted(() => {
  loadRooms();
});
</script>
<template>
  <section>
    <h1>Rooms</h1>
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
      <article v-for="room in rooms" :key="room.room_id">
        <h3>Room{{ room.room_number }}</h3>
        <p>
          Department:
          {{ room.department?.name ?? "Not assigned" }}
        </p>
        <p>
          Type:
          {{ room.room_type ?? "Not specified" }}
        </p>
        <p>
          Status:
          {{ room.status }}
        </p>
        <button @click="editRoom(room)">Edit</button>
        <button @click="handleDeleteRoom(room)">Delete</button>
      </article>
    </div>
  </section>
</template>
