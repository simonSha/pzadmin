import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";

const localState = localStorage.getItem("pz_v3pz");
if (localState) {
  store.commit("dynamicMenu", JSON.parse(localState).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute("main", item);
  });
}

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
