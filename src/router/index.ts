import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import DashboardLayout from "../layouts/DashboardLayout.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/login",
      component: () => import("../views/auth/LoginView.vue"),
    },

    {
      path: "/signup",
      component: () => import("../views/auth/SignUpView.vue"),
    },

    {
      path: "/",
      component: DashboardLayout,
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
          component: () => import("../views/DashboardView.vue"),
        },

        {
          path: "patients",
          component: () => import("../views/PatientsView.vue"),
        },

        {
          path: "staff",
          component: () => import("../views/StaffView.vue"),
        },

        {
          path: "departments",
          component: () => import("../views/DepartmentView.vue"),
        },

        {
          path: "appointments",
          component: () => import("../views/AppointmentsView.vue"),
        },

        {
          path: "rooms",
          component: () => import("../views/RoomsView.vue"),
        },

        {
          path: "supplies",
          component: () => import("../views/SuppliesView.vue"),
        },

        {
          path: "billing",
          component: () => import("../views/BillingView.vue"),
        },

        {
          path: "payroll",
          component: () => import("../views/PayrollView.vue"),
        },
        {
          path: "admissions",
          component: () => import("../views/AdmissionsView.vue"),
        },
        {
          path: "medications",
          component: () => import("../views/MedicationsView.vue"),
        },
        {
          path: "prescription",
          component: () => import("../views/PerscriptionsView.vue"),
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
