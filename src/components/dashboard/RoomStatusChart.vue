<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import type { Room } from "../../types/rooms";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const props = defineProps<{
  rooms: Room[];
}>();
const roomColors: Record<string, string> = {
  Available: "#22c55e",
  Occupied: "#ef4444",
  Cleaning: "#f59e0b",
  Maintenance: "#9ca3af",
  Reserved: "#3b82f6",
};
const chartData = computed(() => {
  const counts: Record<string, number> = {};
  props.rooms.forEach((room) => {
    counts[room.status] = (counts[room.status] || 0) + 1;
  });
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [
      {
        label: "Rooms",
        data: labels.map((status) => counts[status]),
        backgroundColor: labels.map(
          (status) => roomColors[status] ?? "#9ca3af",
        ),
      },
    ],
  };
});
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
<template>
  <div class="chart-container">
    <h2>Room Status</h2>
    <Bar v-if="rooms.length > 0" :data="chartData" :options="chartOptions" />
    <p v-else>No room data.</p>
  </div>
</template>
<style scoped>
.chart-container {
  height: 350px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
