import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.ts";
const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },

    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/auth/SignUpView.vue"),
    },
  ],
});
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }
});
export default router;
