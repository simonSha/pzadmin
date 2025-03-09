import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";

router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");

  if (!token && to.path !== "/login") {
    return "/login";
  } else if (token && to.path == "/login") {
    return "/dashboard";
  }
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
