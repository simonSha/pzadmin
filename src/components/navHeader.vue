<template>
  <div class="header-box flex-box">
    <div class="header-left flex-box">
      <el-icon
        size="24"
        class="hl-fold"
        @click="store.commit('isCollapseChange')"
        ><Fold
      /></el-icon>
      <el-tabs
        v-model="route.path"
        type="card"
        closable
        class="hl-tabs"
        tab-position="bottom"
        @tab-remove="tabRemove"
      >
        <el-tab-pane
          v-for="item in selectMenu"
          :key="item.path"
          :name="item.path"
        >
          <template #label>
            <router-link :to="{ path: item.path }">{{ item.name }}</router-link>
          </template>
          <slot></slot>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="heaeder-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="hr-username">Admin</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { RouterLink, useRoute, useRouter } from "vue-router";
let store = useStore();

const route = useRoute();
const router = useRouter();
console.log(route);
const selectMenu = computed(() => store.state.menu.selectMenu);

const tabRemove = (path) => {
  const value = selectMenu.value;

  const index = value.findIndex((v) => v.path === path);

  store.commit("editMenu", path);

  if (route.path !== path) {
    return;
  }

  console.log(length, index);
  if (value.length === 0) {
    router.push({ path: "/dashboard" });
  } else if (index === 0) {
    router.push({ path: value[0].path });
  } else if (index === value.length) {
    router.push({ path: value[value.length - 1].path });
  }
};

const handleClick = (info) => {
  if (info === "exit") {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("userInfo");
    router.push("/login");
  }
};
</script>

<style lang="less" scoped>
/* 去除a标签的下划线和默认颜色 */
a {
  text-decoration: none; /* 去掉下划线 */
  color: inherit; /* 继承父元素的颜色，或者设置为其他你需要的颜色 */
}

/* 覆盖a标签的各种状态样式 */
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none; /* 在所有状态下都去掉下划线 */
  color: inherit; /* 或者设置为你需要的颜色 */
}
.flex-box {
  display: flex;
  align-items: center;
}
.header-box {
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  .header-left {
    height: 100%;
    .hl-fold {
      width: 45px;
      height: 100%;
    }
    .hl-fold:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    // .hl-tabs {
    //   height: 100%;
    //   margin-bottom: 0;
    //   --el-tabs-header-height: 50px;
    //   .el-tabs--bottom .el-tabs__header.is-bottom {
    //     margin: 0;
    //   }
    // }
  }
  .heaeder-right {
    margin-right: 25px;
    .hr-username {
      margin-left: 10px;
    }
  }
}
</style>
