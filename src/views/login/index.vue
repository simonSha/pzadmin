<template>
  <el-row class="login-box" justify="center" :align="'middle'">
    <el-card style="max-width: 480px;">
        <template #header>
            <div>
                <img width="100%" :src="imgUrl" alt="">
            </div>
        </template>
        <div class="login-switch">
            <el-link type="primary" @click="()=> {isHaveNum = !isHaveNum}">{{ isHaveNum ? '注册账号' : '返回登陆'}}</el-link>
        </div>
        <el-form :model="loginForm" >
            <el-form-item prop="userName">
                <el-input v-model="loginForm.userName" placeholder="请输入用户名" prefix-icon="UserFilled" />
            </el-form-item>
            <el-form-item prop="passWord">
                <el-input v-model="loginForm.passWord" placeholder="请输入密码" prefix-icon="Lock" />
            </el-form-item>
            <el-form-item prop="validCode">
                <el-input v-model="loginForm.validCode" placeholder="请输入验证码" prefix-icon="UserFilled" />
            </el-form-item>
        </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue';

const imgUrl = new URL('../../../public/login-header.png', import.meta.url).href

const isHaveNum = ref(true)
const loginTypeClick = () => {
    isHaveNum = !isHaveNum
}

const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})
</script>

<style lang="less" scoped>
.login-box {
    height: 100%;
    .login-switch {
        text-align: right;
        margin-bottom: 10px;
    }
    .login-input {
        margin-top: 10px;
    }
}


</style>