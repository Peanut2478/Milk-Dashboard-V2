import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),

  routes: [
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

    {
      path: "/",
      component: () => import("../layouts/DashboardLayout.vue"),
      meta: {
        requiresAuth: true,
      },

      children: [
        {
          path: "",
          redirect: "/dashboard",
        },

        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("../views/DashboardView.vue"),
        },

        {
          path: "patients",
          name: "patients",
          component: () => import("../views/PatientsView.vue"),
        },

        {
          path: "staff",
          name: "staff",
          component: () => import("../views/StaffView.vue"),
        },

        {
          path: "appointments",
          name: "appointments",
          component: () => import("../views/AppointmentsView.vue"),
        },

        {
          path: "rooms",
          name: "rooms",
          component: () => import("../views/RoomsView.vue"),
        },

        {
          path: "supplies",
          name: "supplies",
          component: () => import("../views/SuppliesView.vue"),
        },

        {
          path: "billing",
          name: "billing",
          component: () => import("../views/BillingView.vue"),
        },

        {
          path: "payroll",
          name: "payroll",
          component: () => import("../views/PayrollView.vue"),
        },
      ],
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
