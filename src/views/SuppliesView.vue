<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Supply } from "../types/supplies";
import type { Department } from "../types/department.ts";
import { getDepartment } from "../services/departmentServices.ts";
import { createSupplyUsage } from "../services/supplyUsageServices.ts";
import { supabase } from "../lib/supabase.ts";
import { getSupplies, deleteSupply } from "../services/supplyService";
import AddSupplyForm from "../components/supplies/AddSupplyForm.vue";
import EditSupplyForm from "../components/supplies/EditSupplyForm.vue";
const supplies = ref<Supply[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedSupply = ref<Supply | null>(null);

const departments = ref<Department[]>([]);
const usingSupply = ref<Supply | null>(null);
const quantity_used = ref(1);
const usageDepartment = ref("");
const usageNotes = ref("");

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
    departments.value = await getDepartment();
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
async function handleSupplyUsage() {
  if (!usingSupply.value) {
    return;
  }
  if (quantity_used.value <= 0) {
    errorMessage.value = "Quantity used mucst be greater then zero";
    return;
  }
  if (quantity_used.value > usingSupply.value.quantity) {
    errorMessage.value =
      "You can't ust more then the amount currently in stock";
    return;
  }
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      errorMessage.value = "You must be signed in";
      return;
    }
    await createSupplyUsage({
      supply_id: usingSupply.value.supply_id,
      staff_id: user.id,
      quantity_used: quantity_used.value,
      usage_date: new Date().toISOString().split("T")[0],
      dep_id: usageDepartment.value || null,
      notes: usageNotes.value || null,
    });
    usingSupply.value = null;
    quantity_used.value = 1;
    usageDepartment.value = "";
    usageNotes.value = "";
    await loadSupplies();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Faiedl to record supply usage";
  }
}
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
        <button type="button" @click="usingSupply = supply">Use Supply</button>
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
        <form v-if="usingSupply" @submit.prevent="handleSupplyUsage">
          <h2>Use {{ usingSupply.name }}</h2>
          <p>
            Current Stock:
            {{ usingSupply.quantity }}
          </p>
          <div>
            <label>Quantity Used</label>
            <input
              v-model.number="quantity_used"
              type="number"
              min="1"
              :max="usingSupply.quantity"
              required
            />
          </div>

          <div>
            <label>Department</label>
            <select v-model="usageDepartment">
              <option value="">No Department</option>
              <option
                v-for="department in departments"
                :key="department.dep_id"
                :value="department.dep_id"
              >
                {{ department.name }}
              </option>
            </select>
          </div>

          <div>
            <label>Notes</label>

            <textarea
              v-model="usageNotes"
              placeholder="Optional usage notes..."
            />
          </div>

          <button type="submit">Record Usage</button>

          <button type="button" @click="usingSupply = null">Cancel</button>
        </form>
        <button @click="editSupply(supply)">Edit</button>
        <button @click="handleDeleteSupply(supply)">Delete</button>
      </article>
    </div>
  </section>
</template>
