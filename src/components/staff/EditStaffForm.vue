<script setup lang="ts">
import { reactive, ref } from "vue";
import type { Staff } from "../../types/staff";
import { updateStaff } from "../../services/staffServices";

const props = defineProps<{
  member: Staff;
}>();

const emit = defineEmits<{
  staffUpdated: [];
  cancel: [];
}>();

const form = reactive({
  first_name: props.member.first_name,
  last_name: props.member.last_name,
  role: props.member.role,
  department_id: props.member.department_id,
  phone: props.member.phone ?? "",
  email: props.member.email,
  salary: props.member.salary,
  hire_date: props.member.hire_date,
  status: props.member.status,
});

const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";

  try {
    await updateStaff(props.member.id, {
      first_name: form.first_name,
      last_name: form.last_name,
      role: form.role,
      department_id: form.department_id,
      phone: form.phone || null,
      email: form.email,
      salary: form.salary,
      hire_date: form.hire_date,
      status: form.status,
    });

    emit("staffUpdated");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to update staff member.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Edit Staff Member</h2>
    <div>
      <label for="staff-first-name">First Name</label>
      <input
        id="staff-first-name"
        v-model="form.first_name"
        type="text"
        required
      />
    </div>
    <div>
      <label for="staff-last-name">Last Name</label>
      <input
        id="staff-last-name"
        v-model="form.last_name"
        type="text"
        required
      />
    </div>
    <div>
      <label for="staff-role">Role</label>
      <select id="staff-role" v-model="form.role">
        <option value="Admin">Admin</option>
        <option value="Doctor">Doctor</option>
        <option value="Nurse">Nurse</option>
        <option value="Reception">Reception</option>
        <option value="Billing">Billing</option>
        <option value="Pharmacist">Pharmacist</option>
        <option value="Supply Manager">Supply Manager</option>
        <option value="Technician">Technician</option>
      </select>
    </div>
    <div>
      <label for="staff-phone">Phone</label>
      <input id="staff-phone" v-model="form.phone" type="tel" />
    </div>
    <div>
      <label for="staff-email">Email</label>
      <input id="staff-email" v-model="form.email" type="email" required />
    </div>
    <div>
      <label for="staff-salary">Salary</label>
      <input
        id="staff-salary"
        v-model.number="form.salary"
        type="number"
        min="0"
        required
      />
    </div>
    <div>
      <label for="staff-status">Status</label>

      <input id="staff-status" v-model="form.status" type="text" required />
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
