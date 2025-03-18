const localState = localStorage.getItem("pz_v3pz");
const state = localState
  ? JSON.parse(localState).menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [],
    };

const mutations = {
  isCollapseChange(state) {
    state.isCollapse = !state.isCollapse;
  },
  addMenu(state, data) {
    if (state.selectMenu.findIndex((v) => v.path === data.path) === -1) {
      state.selectMenu.push(data);
    }
  },
  editMenu(state, path) {
    const index = state.selectMenu.findIndex((v) => v.path === path);
    if (index !== -1) {
      state.selectMenu.splice(index, 1);
    }
  },
  dynamicMenu(state, data) {
    const modules = import.meta.glob("../views/**/**/*.vue");
    function routerSet(router) {
      router.forEach((route) => {
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
    }
    routerSet(data);
    state.routerList = data;
  },
};

export default {
  state,
  mutations,
};
