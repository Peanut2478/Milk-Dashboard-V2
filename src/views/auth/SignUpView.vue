<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const submitting = ref(false);

async function handleSignup() {
  errorMessage.value = "";
  successMessage.value = "";
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "passwords do not match";
    return;
  }
  submitting.value = true;
  try {
    await auth.signUp(email.value, password.value);
    if (auth.session) {
      await router.push("/dashboard");
    } else {
      successMessage.value =
        "Account created. Check your emailk to confirm accoun";
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to create account";
    }
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <main>
    <h1>Milk Dashboard</h1>
    <h2>Create Account</h2>
    <form @submit.prevent="handleSignup">
      \
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="password">Password</label>

        <input id="password" v-model="password" type="password" required />
      </div>

      <div>
        <label for="confirm-password"> Confirm Password </label>

        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          required
        />
      </div>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage">
        {{ successMessage }}
      </p>

      <button type="submit" :disabled="submitting">
        {{ submitting ? "Creating account..." : "Create Account" }}
      </button>
    </form>
  </main>
</template>
