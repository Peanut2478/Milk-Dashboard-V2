<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
}>();
</script>

<template>
  <div class="stat-card">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<style scoped>
.stat-card {
  padding: 1.25rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.stat-card {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}
</style>
