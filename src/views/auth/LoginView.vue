<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const submitting = ref(false);

async function handleLogin() {
  errorMessage.value = "";
  submitting.value = true;

  try {
    await auth.signIn(email.value, password.value);

    await router.push("/dashboard");
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to sign in.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main>
    <h1>Hospital Dashboard</h1>
    <h2>Sign In</h2>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email</label>

        <input id="email" v-model="email" type="email" required />
      </div>

      <div>
        <label for="password">Password</label>

        <input id="password" v-model="password" type="password" required />
      </div>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="submitting">
        {{ submitting ? "Signing in..." : "Sign In" }}
      </button>
    </form>
  </main>
</template>
