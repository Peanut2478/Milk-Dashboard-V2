<script setup lang="ts">
const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Patients",
    path: "/patients",
  },
  {
    label: "Staff",
    path: "/staff",
  },
  {
    label: "Appointments",
    path: "/appointments",
  },
  {
    label: "Rooms",
    path: "/rooms",
  },
  {
    label: "Supplies",
    path: "/supplies",
  },
  {
    label: "Billing",
    path: "/billing",
  },
  {
    label: "Payroll",
    path: "/payroll",
  },
];
</script>

<template>
  <aside class="sidebar">
    <h2>Hospital Admin</h2>

    <nav>
      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  padding: 1.5rem;
  border-right: 1px solid #ddd;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.sidebar a {
  color: inherit;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 8px;
}

.sidebar a.router-link-active {
  font-weight: 600;
  background: #f0f0f0;
}
</style>
