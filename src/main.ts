import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth.ts";
import "./style.css";
async function bootstrap() {
  // start and oprer applkication
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  const auth = useAuthStore(pinia);
  await auth.initializeAuth();
  app.use(router);
  app.mount("#app");
}
bootstrap();
