<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Medication, NewMedication } from "../types/medications";
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} from "../services/medicationService";
const medications = ref<Medication[]>([]);
const editingMedication = ref<Medication | null>(null);
const name = ref("");
const dosageForm = ref("");
const strength = ref("");
const manufacturer = ref("");
const quantity = ref(0);
const reorderLevel = ref(0);

const searchTerm = ref("");
const stockFilter = ref("");

const loading = ref(false);
const errorMessage = ref("");
// f u func
const filteredMedications = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return medications.value.filter((medication) => {
    const name = medication.name?.toLowerCase() ?? "";
    const manufacturer = medication.manufacturer?.toLowerCase() ?? "";
    const matchesSearch =
      search === "" || name.includes(search) || manufacturer.includes(search);
    const isLowStock = medication.quantity_in_stock <= medication.reorder_level;
    let matchesStock = true;

    if (stockFilter.value === "low") {
      matchesStock = isLowStock;
    }
    if (stockFilter.value === "normal") {
      matchesStock = !isLowStock;
    }
    return matchesSearch && matchesStock;
  });
});
async function loadMedications() {
  loading.value = true;
  errorMessage.value = "";

  try {
    medications.value = await getMedications();

    console.log("VIEW MEDICATIONS:", medications.value);
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to load medications.";
  } finally {
    loading.value = false;
  }
}
async function handleSubmit() {
  errorMessage.value = "";
  if (!name.value) {
    errorMessage.value = "Medication name is required.";
    return;
  }
  if (quantity.value < 0 || reorderLevel.value < 0) {
    errorMessage.value = "Quantity and reorder level cannot be negative.";
    return;
  }
  const medicationData: NewMedication = {
    name: name.value,
    dosage_form: dosageForm.value || null,
    strength: strength.value || null,
    manufacturer: manufacturer.value || null,
    quantity_in_stock: quantity.value,
    reorder_level: reorderLevel.value,
  };
  try {
    if (editingMedication.value) {
      await updateMedication(
        editingMedication.value.medication_id,
        medicationData,
      );
    } else {
      await createMedication(medicationData);
    }
    resetForm();
    await loadMedications();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to save medication.";
  }
}
function startEdit(medication: Medication) {
  editingMedication.value = medication;
  name.value = medication.name;
  dosageForm.value = medication.dosage_form ?? "";
  strength.value = medication.strength ?? "";
  manufacturer.value = medication.manufacturer ?? "";
  quantity.value = medication.quantity_in_stock;
  reorderLevel.value = medication.reorder_level;
}
function resetForm() {
  editingMedication.value = null;
  name.value = "";
  dosageForm.value = "";
  strength.value = "";
  manufacturer.value = "";
  quantity.value = 0;
  reorderLevel.value = 0;
}
async function handleDelete(medication: Medication) {
  const confirmed = window.confirm(`Delete ${medication.name}?`);
  if (!confirmed) {
    return;
  }
  try {
    await deleteMedication(medication.medication_id);
    await loadMedications();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to delete medication.";
  }
}
onMounted(() => {
  loadMedications();
});
</script>
<template>
  <div>
    <h1>Medications</h1>
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
    <form @submit.prevent="handleSubmit">
      <h2>
        {{ editingMedication ? "Edit Medication" : "Add Medication" }}
      </h2>
      <div>
        <label>Name</label>
        <input v-model="name" required />
      </div>
      <div>
        <label>Dosage Form</label>
        <input v-model="dosageForm" placeholder="Tablet, Capsule, Liquid..." />
      </div>
      <div>
        <label>Strength</label>
        <input v-model="strength" placeholder="500 mg" />
      </div>
      <div>
        <label>Manufacturer</label>
        <input v-model="manufacturer" />
      </div>
      <div>
        <label>Quantity in Stock</label>
        <input v-model.number="quantity" type="number" min="0" />
      </div>
      <div>
        <label>Reorder Level</label>
        <input v-model.number="reorderLevel" type="number" min="0" />
      </div>
      <button type="submit">
        {{ editingMedication ? "Save Changes" : "Add Medication" }}
      </button>
      <button v-if="editingMedication" type="button" @click="resetForm">
        Cancel
      </button>
    </form>
    <div class="medication-filters">
      <input v-model="searchTerm" placeholder="Search medication..." />
      <select v-model="stockFilter">
        <option value="">All Stock</option>
        <option value="low">Low Stock</option>
        <option value="normal">In Stock</option>
      </select>
    </div>
    <p v-if="loading">Loading medications...</p>
    <p v-else-if="filteredMedications.length === 0">No medications found.</p>
    <article
      v-for="medication in filteredMedications"
      :key="medication.medication_id"
    >
      <h3>
        {{ medication.name }}
        <span v-if="medication.strength">
          {{ medication.strength }}
        </span>
      </h3>
      <p>
        Form:
        {{ medication.dosage_form ?? "N/A" }}
      </p>
      <p>
        Manufacturer:
        {{ medication.manufacturer ?? "N/A" }}
      </p>
      <p>
        Stock:
        {{ medication.quantity_in_stock }}
      </p>

      <p>
        Reorder Level:
        {{ medication.reorder_level }}
      </p>
      <p
        v-if="medication.quantity_in_stock <= medication.reorder_level"
        class="low-stock"
      >
        Low Stock
      </p>
      <button type="button" @click="startEdit(medication)">Edit</button>
      <button type="button" @click="handleDelete(medication)">Delete</button>
    </article>
  </div>
</template>

<style scoped>
.medication-filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.medication-filters input,
.medication-filters select {
  width: auto;
  min-width: 180px;
}
.low-stock {
  font-weight: 600;
  color: #b91c1c;
}
input,
select,
textarea {
  color: #1f2937;
  background-color: white;
}
input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}
</style>
