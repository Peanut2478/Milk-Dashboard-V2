<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
}>();
</script>

<template>
  <div class="stat-card">
    <h3 class="stat-title">{{ title }}</h3>
    <p class="stat-value">{{ value }}</p>
  </div>
</template>

<style scoped>
.stat-card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  min-width: 0;
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-title {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.4;
}

.stat-value {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
</style>
