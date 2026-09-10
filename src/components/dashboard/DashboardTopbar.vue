<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.signOut();
  await router.push("/login");
}
</script>
<template>
  <header class="topbar">
    <div>
      <h1>Hospital Management System</h1>
      <p v-if="auth.user">
        {{ auth.user.email }}
      </p>
    </div>
    <button @click="handleLogout">Sign Out</button>
  </header>
</template>
<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
}
.topbar h1 {
  margin: 0;
  font-size: 1.25rem;
}
.topbar p {
  margin: 0.25rem 0 0;
  align-items: center;
}
.topbar button {
  padding: 0.5rem 1rem;
}
</style>
