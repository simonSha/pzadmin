<template>
  <template v-for="(item, index) in props.menuData" :key="item.meta.path">
    <el-menu-item
      v-if="!item.children || item.children.length == 0"
      :index="item.meta.path"
      @click="handleClick(item, item.meta.path)"
    >
      <el-icon size="20"><component :is="item.meta.icon"></component></el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="item.meta.path">
      <template #title>
        <el-icon size="20"
          ><component :is="item.meta.icon"></component
        ></el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu :menuData="item.children"></tree-menu>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps(["menuData", "index"]);
const router = useRouter();

const store = useStore();

function handleClick(item, activeIndex) {
  store.commit("addMenu", item.meta);
  router.push(item.meta.path);

  console.log(item.meta.path, activeIndex);
}
</script>
