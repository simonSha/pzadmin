<template>
  <el-menu
    :style="{ width: isCollapse ? '' : '230px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    default-active="/dashboard"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <p class="logo-pz">{{ isCollapse ? "陪诊" : "便捷陪诊" }}</p>
    <TreeMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>

<script setup>
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const handleOpen = () => {};
const handleClose = () => {};

const router = useRouter();
// const menuData = reactive(router.options.routes[0].children);
const menuData = computed(() => store.state.menu.routerList);

const store = useStore();

const isCollapse = computed(() => store.state.menu.isCollapse);
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-pz {
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    text-align: center;
  }
}
</style>
