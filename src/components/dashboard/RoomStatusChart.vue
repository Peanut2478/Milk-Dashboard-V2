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
const chartData = computed(() => {
  const counts: Record<string, number> = {};
  props.rooms.forEach((room) => {
    counts[room.status] = (counts[room.status] ?? 0) + 1;
  });
  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Rooms",
        data: Object.values(counts),
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
