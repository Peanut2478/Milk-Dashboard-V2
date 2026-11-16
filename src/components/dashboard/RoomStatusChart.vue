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
import type { ChartOptions } from "chart.js";
import type { Room } from "../../types/rooms";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const props = defineProps<{
  rooms: Room[];
}>();

const statuses = [
  "Available",
  "Occupied",
  "Cleaning",
  "Maintenance",
  "Reserved",
];

const roomColors: Record<string, string> = {
  Available: "#22c55e",
  Occupied: "#ef4444",
  Cleaning: "#f59e0b",
  Maintenance: "#9ca3af",
  Reserved: "#3b82f6",
};

const chartData = computed(() => ({
  labels: statuses,
  datasets: [
    {
      label: "Rooms",
      data: statuses.map(
        (status) => props.rooms.filter((room) => room.status === status).length,
      ),
      backgroundColor: statuses.map((status) => roomColors[status]),
      borderRadius: 5,
      maxBarThickness: 48,
    },
  ],
}));

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} rooms`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        stepSize: 2,
      },
      grid: {
        color: "#f1f5f9",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 35,
        minRotation: 0,
        font: {
          size: 11,
        },
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <h2>Room Status</h2>

    <div v-if="rooms.length > 0" class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <p v-else class="empty-message">No room data.</p>
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
