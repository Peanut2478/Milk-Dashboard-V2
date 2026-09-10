import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => {
    return session.value !== null;
  });

  async function initializeAuth() {
    loading.value = true;

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("EWrror loading sessiohn", error);
      user.value = null;
      session.value = null;
      loading.value = false;
      return;
    }
    session.value = data.session;
    user.value = data.session?.user ?? null;

    loading.value = false;

    supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth event:", event);

      session.value = newSession;
      user.value = newSession?.user ?? null;
    });
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    user.value = data.user;
    session.value = data.session;
  }
  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    user.value = data.user;
    session.value = data.session;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    user.value = null;
    session.value = null;
  }
  return {
    user,
    session,
    loading,
    isAuthenticated,
    initializeAuth,
    signIn,
    signOut,
    signUp,
  };
});
