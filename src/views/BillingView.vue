<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Bill } from "../types/billing";
import type { Payment } from "../types/payment.ts";
import {
  createPayment,
  getPaymentsByBill,
} from "../services/paymentService.ts";
import { getBills, deleteBill } from "../services/billingService";
import EditBillForm from "../components/billing/EditBillForm.vue";
import AddBillForm from "../components/billing/AddBillForm.vue";
const bills = ref<Bill[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedBill = ref<Bill | null>(null);
const payingBill = ref<Bill | null>(null);
const paymentAmount = ref(1);
const paymentMethod = ref("");
const paymentDate = ref(new Date().toISOString().split("T")[0]);
const paymentHistory = ref<Payment[]>([]);
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
const remainingBalance = computed(() => {
  if (!payingBill.value) {
    return 0;
  }
  return Math.max(
    Number(payingBill.value.amount) - Number(payingBill.value.amount_paid),
    0,
  );
});
async function handlePayment() {
  errorMessage.value = "";
  if (!payingBill.value) return;
  if (!payingBill.value.patient_id) {
    errorMessage.value = "This bill does not have a patiend";
    return;
  }
  if (paymentAmount.value === null || paymentAmount.value <= 0) {
    errorMessage.value = "Enter a valid payment amount";
  }
  if (paymentAmount.value > remainingBalance.value) {
    errorMessage.value = "Payment can not exceed the remaining balance";
    return;
  }
  try {
    await createPayment({
      bill_id: payingBill.value.bill_id,
      patient_id: payingBill.value.patient_id,
      amount: paymentAmount.value,
      payment_date: paymentDate.value,
      payment_method: paymentMethod.value,
    });
    payingBill.value = null;
    paymentAmount.value = 0;
    paymentMethod.value = "Card";
    await loadBills();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Error can not do payment mf";
  }
}
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
        <button
          v-if="
            Number(bill.amount_paid) < Number(bill.amount) &&
            bill.status !== 'Cancelled'
          "
          type="button"
          @click="
            payingBill = bill;
            paymentAmount = 0;
          "
        >
          Record Payment
        </button>
        <form v-if="payingBill" @submit.prevent="handlePayment">
          <h2>Record Payment</h2>
          <p>
            Patient:
            {{
              payingBill.patient
                ? `${payingBill.patient.first_name} ${payingBill.patient.last_name}`
                : "Unknown"
            }}
          </p>
          <p>Bill Total: ${{ Number(payingBill.amount).toFixed(2) }}</p>
          <p>Already Paid: ${{ Number(payingBill.amount_paid).toFixed(2) }}</p>
          <p>Remaining: ${{ remainingBalance.toFixed(2) }}</p>
          <div>
            <label>Payment Amount</label>
            <input
              v-model.number="paymentAmount"
              type="number"
              min="0.01"
              step="0.01"
              :max="remainingBalance"
              required
            />
          </div>

          <div>
            <label>Payment Method</label>
            <select v-model="paymentMethod">
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Payment Date</label>
            <input v-model="paymentDate" type="date" required />
          </div>
          <button type="submit">Record Payment</button>
          <button type="button" @click="payingBill = null">Cancel</button>
        </form>
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
