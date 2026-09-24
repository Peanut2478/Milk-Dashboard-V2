<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { Appointment } from "../../types/appointments";
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps<{
  appointments: Appointment[];
}>();
const statusColors: Record<string, string> = {
  Scheduled: "#3b82f6",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
  "No Show": "#f59e0b",
};
const chartData = computed(() => {
  const counts: Record<string, number> = {};
  props.appointments.forEach((appointment) => {
    counts[appointment.status] = (counts[appointment.status] || 0) + 1;
  });
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [
      {
        data: labels.map((status) => counts[status]),
        backgroundColor: labels.map(
          (status) => statusColors[status] ?? "#9ca3af",
        ),
        borderWidth: 0,
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
    <h2>Appointment Status</h2>
    <Doughnut
      v-if="appointments.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else>No appointment data.</p>
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
