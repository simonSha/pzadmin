const state = {
  isCollapse: false,
  selectMenu: [],
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
    console.log(path, index);
    if (index !== -1) {
      state.selectMenu.splice(index, 1);
    }
  },
};

export default {
  state,
  mutations,
};
