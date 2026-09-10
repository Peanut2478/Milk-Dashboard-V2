<script setup lang="ts">
import StatCard from "../components/dashboard/StatCard.vue";
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { supabase } from "../lib/supabase.ts";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.ts";
const title = "Milk Dashboard";

const stats = ref([
  {
    title: "Patients",
    value: 1284,
  },
  {
    title: "Staff",
    value: 347,
  },
  {
    title: "Today's Appointments",
    value: 82,
  },
  {
    title: "Rooms Occupied",
    value: "92%",
  },
]);
const totalStats = computed(() => {
  return stats.value.length;
});
const auth = useAuthStore();
const router = useRouter();
async function handleLogout() {
  await auth.signOut();
  await router.push("/login");
}
function addPatient() {
  stats.value[0].value = Number(stats.value[0].value) + 1;
}
onMounted(async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabasse connection error:", error);
    return;
  }

  console.log("supabase connection works:", data);
});
</script>

<template>
  <main>
    <h1>{{ title }}</h1>
    <p>Total dashboard metrics: {{ totalStats }}</p>
    <button @click="addPatient">Add Patient</button>
    <div class="stats-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
      />
    </div>
    <p>Dashboard is working!</p>
    <button @click="handleLogout">Sign Out</button>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
