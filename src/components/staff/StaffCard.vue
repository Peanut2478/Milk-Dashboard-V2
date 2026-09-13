<script setup lang="ts">
import type { Staff } from "../../types/staff";

defineProps<{
  member: Staff;
}>();

const emit = defineEmits<{
  edit: [member: Staff];
  delete: [member: Staff];
}>();
</script>
<template>
  <article class="staff-card">
    <h3>
      {{ member.first_name }}
      {{ member.last_name }}
    </h3>
    <p>Role: {{ member.role }}</p>
    <p>Status: {{ member.status }}</p>
    <p>Email: {{ member.email }}</p>
    <p>Phone: {{ member.phone ?? "No phone" }}</p>
    <p>Salary: ${{ member.salary }}</p>

    <button @click="emit('edit', member)">Edit</button>
    <button @click="emit('delete', member)">Delete</button>
  </article>
</template>

<style scoped>
.staff-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.staff-card h3 {
  margin-top: 0;
}
</style>
