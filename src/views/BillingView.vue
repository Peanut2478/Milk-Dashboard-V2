<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Bill } from "../types/billing";
import { getBills, deleteBill } from "../services/billingService";
import EditBillForm from "../components/billing/EditBillForm.vue";
import AddBillForm from "../components/billing/AddBillForm.vue";
const bills = ref<Bill[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedBill = ref<Bill | null>(null);

function editBill(bill: Bill) {
  selectedBill.value = bill;
}

async function handleBillUpdated() {
  selectedBill.value = null;
  await loadBills();
}
async function handleDeleteBill(bill: Bill) {
  const confirmed = window.confirm(
    `Delete this $${Number(bill.amount).toFixed(2)} bill?`,
  );
  if (!confirmed) {
    return;
  }
  try {
    await deleteBill(bill.bill_id);
    await loadBills();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to delete bill.";
    }
  }
}
async function loadBills() {
  loading.value = false;
  errorMessage.value = "";
  try {
    bills.value = await getBills();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "DId not work ";
    }
  } finally {
    loading.value = false;
  }
}
const totalBilled = computed(() => {
  return bills.value.reduce((total, bill) => total + Number(bill.amount), 0);
});
const outstandingBalance = computed(() => {
  return bills.value.reduce(
    (total, bill) => total + (Number(bill.amount) - Number(bill.amount_paid)),
    0,
  );
});
const openBillCount = computed(() => {
  return bills.value.filter(
    (bill) =>
      bill.status === "Pending" ||
      bill.status === "Partially Paid" ||
      bill.status === "Overdue",
  ).length;
});

const searchTerm = ref("");
const selectedStatus = ref("");
const filteredBills = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  return bills.value.filter((bill) => {
    const patientName = bill.patient
      ? `${bill.patient.first_name} ${bill.patient.last_name}`.toLowerCase()
      : "";
    const description = bill.description?.toLowerCase() ?? "";
    const matchesSearch =
      !search || patientName.includes(search) || description.includes(search);
    const matchesStatus =
      !selectedStatus.value || bill.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});
onMounted(() => {
  loadBills();
});
</script>
<template>
  <section>
    <h1>Billing</h1>
    <div class="billing-filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search patient or description..."
      />
      <select v-model="selectedStatus">
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Overdue">Overdue</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        type="button"
        @click="
          searchTerm = '';
          selectedStatus = '';
        "
      >
        Clear Filters
      </button>
    </div>
    <AddBillForm />
    <EditBillForm
      v-if="selectedBill"
      :bill="selectedBill"
      @bill-updated="handleBillUpdated"
      @cancel="selectedBill = null"
    />
    <div>
      <p>Total Billed: ${{ totalBilled.toFixed(2) }}</p>

      <p>Outstanding Balance: ${{ outstandingBalance.toFixed(2) }}</p>
      <p>
        Open Bills:
        {{ openBillCount }}
      </p>
    </div>
    <p v-if="loading">Loading billing records...</p>
    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p v-else-if="bills.length === 0">No billing records found.</p>
    <div v-else>
      <article v-for="bill in filteredBills" :key="bill.bill_id">
        <h3>${{ Number(bill.amount).toFixed(2) }}</h3>
        <p>
          Patient:
          <span v-if="bill.patient">
            {{ bill.patient.first_name }}
            {{ bill.patient.last_name }}
          </span>
          <span v-else> Not assigned </span>
        </p>
        <p>Total: ${{ Number(bill.amount).toFixed(2) }}</p>
        <p>Paid: ${{ Number(bill.amount_paid).toFixed(2) }}</p>
        <p>Balance: ${{ Number(bill.amount) - Number(bill.amount_paid) }}</p>
        <p>
          Description:
          {{ bill.description ?? "No description" }}
        </p>
        <p>
          Bill Date:
          {{ bill.bill_date }}
        </p>
        <span
          class="status-badge"
          :class="bill.status.toLowerCase().replaceAll(' ', '-')"
        >
          {{ bill.status }}
        </span>
        <p v-if="bill.appointment">
          Appointment:
          {{ bill.appointment.appointment_date }}
          at
          {{ bill.appointment.appointment_time }}
        </p>
        <button @click="editBill(bill)">Edit</button>
        <button @click="handleDeleteBill(bill)">Delete</button>
      </article>
    </div>
  </section>
</template>
<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.pending {
  background: #fef3c7;
}
.paid {
  background: #dcfce7;
}
.partially-paid {
  background: #dbeafe;
}
.overdue {
  background: #fee2e2;
}
.cancelled {
  background: #e5e7eb;
}
.billing-filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
</style>
