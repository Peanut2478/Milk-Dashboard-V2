<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Payroll } from "../types/payroll";
import { getPayroll, runPayroll } from "../services/payrollService";

const payroll = ref<Payroll[]>([]);
const payPeriodStart = ref("");
const payPeriodEnd = ref("");
const loading = ref(true);
const runningPayroll = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function loadPayroll() {
  loading.value = true;
  errorMessage.value = "";
  try {
    payroll.value = await getPayroll();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to load payroll.";
    }
  } finally {
    loading.value = false;
  }
}
const selectedPayroll = computed(() => {
  return payroll.value.filter(
    (record) =>
      record.pay_period_start === payPeriodStart.value &&
      record.pay_period_end === payPeriodEnd.value,
  );
});

const totalPayroll = computed(() => {
  return selectedPayroll.value.reduce(
    (total, record) => total + Number(record.amount),
    0,
  );
});

const employeesPaid = computed(() => {
  return new Set(payroll.value.map((record) => record.staff_id)).size;
});
async function handleRunPayroll() {
  errorMessage.value = "";
  successMessage.value = "";
  if (!payPeriodStart.value || !payPeriodEnd.value) {
    errorMessage.value = "Please select a pay period.";
    return;
  }
  if (payPeriodEnd.value < payPeriodStart.value) {
    errorMessage.value = "Pay period end cannot be before the start.";
    return;
  }
  const confirmed = window.confirm(
    `Run payroll from ${payPeriodStart.value} through ${payPeriodEnd.value}?`,
  );
  if (!confirmed) {
    return;
  }
  runningPayroll.value = true;
  try {
    await runPayroll(payPeriodStart.value, payPeriodEnd.value);
    successMessage.value = "Payroll completed successfully.";
    await loadPayroll();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to run payroll.";
    }
  } finally {
    runningPayroll.value = false;
  }
}
onMounted(() => {
  loadPayroll();
});
</script>
<template>
  <section>
    <h1>Payroll</h1>

    <div>
      <h2>Run Payroll</h2>

      <div>
        <label for="pay-period-start"> Pay Period Start </label>

        <input id="pay-period-start" v-model="payPeriodStart" type="date" />
      </div>

      <div>
        <label for="pay-period-end"> Pay Period End </label>

        <input id="pay-period-end" v-model="payPeriodEnd" type="date" />
      </div>

      <button :disabled="runningPayroll" @click="handleRunPayroll">
        {{ runningPayroll ? "Running..." : "Run Payroll" }}
      </button>
    </div>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage">
      {{ successMessage }}
    </p>
    <div>
      <h2>Payroll Summary</h2>
      <p>Total Payroll: ${{ totalPayroll.toFixed(2) }}</p>
      <p>
        Employees Paid:
        {{ employeesPaid }}
      </p>
    </div>
    <p v-if="loading">Loading payroll...</p>
    <p v-else-if="payroll.length === 0">No payroll records found.</p>
    <div v-else>
      <article v-for="record in payroll" :key="record.payroll_id">
        <h3 v-if="record.staff_member">
          {{ record.staff_member.first_name }}
          {{ record.staff_member.last_name }}
        </h3>
        <p>
          Role:
          {{ record.staff_member?.role ?? "Unknown" }}
        </p>
        <p>Amount: ${{ Number(record.amount).toFixed(2) }}</p>
        <p>
          Pay Period:
          {{ record.pay_period_start }}
          —
          {{ record.pay_period_end }}
        </p>
        <p>
          Paid:
          {{ record.pay_date }}
        </p>
        <p>
          Status:
          {{ record.status }}
        </p>
      </article>
    </div>
  </section>
</template>
