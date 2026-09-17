<script setup lang="ts">
import { ref } from "vue";
import { createSupply } from "../../services/supplyService";

const emit = defineEmits<{
  supplyAdded: [];
}>();
const name = ref("");
const quantity = ref<number | null>(null);
const reorderLevel = ref<number>(100);
const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";
  if (quantity.value === null) {
    errorMessage.value = "Quantity is required.";
    return;
  }
  submitting.value = true;
  try {
    await createSupply({
      name: name.value,
      quantity: quantity.value,
      reorder_level: reorderLevel.value,
    });

    name.value = "";
    quantity.value = null;
    reorderLevel.value = 100;
    emit("supplyAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create supply.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Supply</h2>
    <div>
      <label for="supply-name"> Supply Name </label>
      <input id="supply-name" v-model="name" type="text" required />
    </div>
    <div>
      <label for="supply-quantity"> Quantity </label>
      <input
        id="supply-quantity"
        v-model.number="quantity"
        type="number"
        min="0"
        required
      />
    </div>
    <div>
      <label for="reorder-level"> Reorder Level </label>
      <input
        id="reorder-level"
        v-model.number="reorderLevel"
        type="number"
        min="0"
        required
      />
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Supply" }}
    </button>
  </form>
</template>
