<script setup lang="ts">
import { ref } from "vue";
import { createStaff } from "../../services/staffServices";
const emit = defineEmits<{
  staffAdded: [];
}>();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("");
const departmentId = ref("");
const phone = ref("");
const salary = ref<number | null>(null);
const hireDate = ref("");
const status = ref("");

const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  if (salary.value === null) {
    errorMessage.value = "Salary is required.";
    return;
  }

  submitting.value = true;

  try {
    await createStaff({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      role: role.value,
      department_id: departmentId.value || null,
      phone: phone.value || null,
      salary: salary.value,
      hire_date: hireDate.value,
      status: status.value,
    });

    firstName.value = "";
    lastName.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    role.value = "";
    departmentId.value = "";
    phone.value = "";
    salary.value = null;
    hireDate.value = "";
    status.value = "";

    emit("staffAdded");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create staff member.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add Staff Member</h2>
    <div>
      <label for="staff-first-name"> First Name </label>
      <input id="staff-first-name" v-model="firstName" type="text" required />
    </div>
    <div>
      <label for="staff-last-name"> Last Name </label>
      <input id="staff-last-name" v-model="lastName" type="text" required />
    </div>
    <div>
      <label for="staff-email"> Email </label>
      <input id="staff-email" v-model="email" type="email" required />
    </div>
    <div>
      <label for="staff-password"> Password </label>
      <input id="staff-password" v-model="password" type="password" required />
    </div>
    <div>
      <label for="staff-confirm-password"> Confirm Password </label>
      <input
        id="staff-confirm-password"
        v-model="confirmPassword"
        type="password"
        required
      />
    </div>

    <div>
      <label for="staff-role"> Role </label>
      <select id="staff-role" v-model="role" required>
        <option value="">Select Role</option>
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
      <label for="staff-department"> Department ID </label>

      <input id="staff-department" v-model="departmentId" type="text" />
    </div>
    <div>
      <label for="staff-phone"> Phone </label>

      <input id="staff-phone" v-model="phone" type="tel" />
    </div>
    <div>
      <label for="staff-salary"> Salary </label>
      <input
        id="staff-salary"
        v-model.number="salary"
        type="number"
        min="0"
        required
      />
    </div>
    <div>
      <label for="staff-hire-date"> Hire Date </label>

      <input id="staff-hire-date" v-model="hireDate" type="date" required />
    </div>
    <div>
      <label for="staff-status"> Status </label>

      <input id="staff-status" v-model="status" type="text" required />
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <button type="submit" :disabled="submitting">
      {{ submitting ? "Creating..." : "Add Staff" }}
    </button>
  </form>
</template>
