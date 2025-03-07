<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <NavHeader />
        </el-header>
        <el-main> <RouterView></RouterView> </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/aside.vue";
import NavHeader from "../components/navHeader.vue";
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      // transition: width 0.3s linear;
      width: auto;
    }
  }
}
</style>
