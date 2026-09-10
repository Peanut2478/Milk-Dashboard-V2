<script setup lang="ts">
import DashboardSidebar from "../components/dashboard/DashboardSidebar.vue";
import DashboardTopbar from "../components/dashboard/DashboardTopbar.vue";
</script>

<template>
  <div class="dashboard-layout">
    <DashboardSidebar />
    <section class="main-area">
      <DashboardTopbar />
      <main class="page-content">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.main-area {
  flex: 1;
}
.page-content {
  padding: 2rem;
}
</style>
