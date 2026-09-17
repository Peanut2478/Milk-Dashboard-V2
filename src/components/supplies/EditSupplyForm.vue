<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Supply } from "../../types/supplies";
import { updateSupply } from "../../services/supplyService";

const props = defineProps<{
  supply: Supply;
}>();
const emit = defineEmits<{
  supplyUpdated: [];
  cancel: [];
}>();
const form = reactive({
  name: props.supply.name,
  quantity: props.supply.quantity,
  reorder_level: props.supply.reorder_level ?? 100,
});
const submitting = ref(false);
const errorMessage = ref("");
async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";
  try {
    await updateSupply(props.supply.supply_id, {
      name: form.name,
      quantity: form.quantity,
      reorder_level: form.reorder_level,
    });
    emit("supplyUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Update cnat owrk";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Edit Supply</h2>
    <div>
      <label for="edit-supply-name"> Supply Name </label>
      <input id="edit-supply-name" v-model="form.name" type="text" required />
    </div>
    <div>
      <label for="edit-supply-quantity"> Quantity </label>

      <input
        id="edit-supply-quantity"
        v-model.number="form.quantity"
        type="number"
        min="0"
        required
      />
    </div>
    <div>
      <label for="edit-reorder-level"> Reorder Level </label>
      <input
        id="edit-reorder-level"
        v-model.number="form.reorder_level"
        type="number"
        min="0"
        required
      />
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <button type="submit" :disabled="submitting">
      {{ submitting ? "Saving..." : "Save Changes" }}
    </button>

    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
