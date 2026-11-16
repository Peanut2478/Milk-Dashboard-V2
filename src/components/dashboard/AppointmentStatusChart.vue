<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions } from "chart.js";
import type { Appointment } from "../../types/appointments";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  appointments: Appointment[];
}>();

const statuses = ["Scheduled", "Completed", "Cancelled", "No Show"];

const statusColors: Record<string, string> = {
  Scheduled: "#3b82f6",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
  "No Show": "#f59e0b",
};

const chartData = computed(() => {
  const counts = statuses.map(
    (status) =>
      props.appointments.filter((appointment) => appointment.status === status)
        .length,
  );

  return {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: statuses.map((status) => statusColors[status]),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };
});

const hasData = computed(() =>
  chartData.value.datasets[0].data.some((count) => count > 0),
);

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 16,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
        },
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <h2>Appointment Status</h2>

    <div v-if="hasData" class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <p v-else class="empty-message">No appointment data.</p>
  </div>
</template>

<style scoped>
.chart-container {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  min-width: 0;
}

.chart-container h2 {
  margin: 0 0 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

.empty-message {
  color: #64748b;
  font-size: 0.875rem;
}
</style>
