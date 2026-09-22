<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { Appointment } from "../../types/appointments";
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps<{
  appointments: Appointment[];
}>();
const chartData = computed(() => {
  const counts: Record<string, number> = {};
  props.appointments.forEach((appointment) => {
    const status = appointment.status;
    counts[status] = (counts[status] ?? 0) + 1;
  });

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Appointments",
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
