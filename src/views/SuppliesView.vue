<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Supply } from "../types/supplies";
import { getSupplies, deleteSupply } from "../services/supplyService";
import AddSupplyForm from "../components/supplies/AddSupplyForm.vue";
import EditSupplyForm from "../components/supplies/EditSupplyForm.vue";
const supplies = ref<Supply[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedSupply = ref<Supply | null>(null);
function editSupply(supply: Supply) {
  selectedSupply.value = supply;
}
async function handleSupplyUpdated() {
  selectedSupply.value = null;
  await loadSupplies();
}
async function handleDeleteSupply(supply: Supply) {
  const confirmed = window.confirm(`Delete ${supply.name}?`);
  if (!confirmed) {
    return;
  }
  try {
    await deleteSupply(supply.supply_id);
    await loadSupplies();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete supply.";
    }
  }
}
async function loadSupplies() {
  loading.value = true;
  errorMessage.value = "";
  try {
    supplies.value = await getSupplies();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to laod supplies";
    }
  } finally {
    loading.value = false;
  }
}
const lowStockCount = computed(() => {
  return supplies.value.filter((supply) => {
    if (supply.reorder_level === null) {
      return false;
    }
    return supply.quantity <= supply.reorder_level;
  }).length;
});
const searchTerm = ref("");
const stockFilter = ref("");

const filteredSupplies = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return supplies.value.filter((supply) => {
    const matchesSearch = !search || supply.name.toLowerCase().includes(search);
    const isLowStock =
      supply.reorder_level !== null && supply.quantity <= supply.reorder_level;
    const matchesStock =
      !stockFilter.value ||
      (stockFilter.value === "low" && isLowStock) ||
      (stockFilter.value === "normal" && !isLowStock);
    return matchesSearch && matchesStock;
  });
});
onMounted(() => {
  loadSupplies();
});
</script>
<template>
  <section>
    <h1>Supplies</h1>
    <div class="supply-filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search supplies..."
      />
      <select v-model="stockFilter">
        <option value="">All Stock</option>
        <option value="low">Low Stock</option>
        <option value="normal">In Stock</option>
      </select>
      <button
        type="button"
        @click="
          searchTerm = '';
          stockFilter = '';
        "
      >
        Clear Filters
      </button>
    </div>
    <AddSupplyForm @supply-added="loadSupplies" />
    <EditSupplyForm
      v-if="selectedSupply"
      :supply="selectedSupply"
      @supply-updated="handleSupplyUpdated"
      @cancel="selectedSupply = null"
    />
    <p>Low Stock Items: {{ lowStockCount }}</p>
    <p v-if="loading">Loading supplies...</p>

    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p v-else-if="supplies.length === 0">No supplies found.</p>
    <div v-else>
      <article v-for="supply in filteredSupplies" :key="supply.supply_id">
        <h3>{{ supply.name }}</h3>
        <p>Quantity: {{ supply.quantity }}</p>
        <p>
          Reorder Level:
          {{ supply.reorder_level ?? "Not set" }}
        </p>
        <p
          v-if="
            supply.reorder_level !== null &&
            supply.quantity <= supply.reorder_level
          "
        >
          ⚠ Low Stock
        </p>
        <p v-else>In Stock</p>
        <button @click="editSupply(supply)">Edit</button>
        <button @click="handleDeleteSupply(supply)">Delete</button>
      </article>
    </div>
  </section>
</template>
