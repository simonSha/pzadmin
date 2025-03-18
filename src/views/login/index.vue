<template>
  <el-row class="login-box" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div>
          <img width="430px" :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="login-switch">
        <el-link
          type="primary"
          @click="
            () => {
              isHaveNum = !isHaveNum;
            }
          "
          >{{ isHaveNum ? "注册账号" : "返回登陆" }}</el-link
        >
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        max-width="600px"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="请输入用户名"
            prefix-icon="UserFilled"
          />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            placeholder="请输入密码"
            prefix-icon="Lock"
            type="password"
          />
        </el-form-item>
        <el-form-item v-if="!isHaveNum" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="请输入验证码"
            prefix-icon="UserFilled"
          >
            <template #append>
              <span
                style="width: 70px; text-align: center"
                @click="sendCodeClick"
              >
                {{ codeShowInfo.text }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="commitBtn">
          <el-button
            style="width: 100%"
            type="primary"
            @click="submitForm(loginFormRef)"
          >
            {{ isHaveNum ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed, toRaw } from "vue";
import { getCode, login, authentication, menuPermissions } from "../../api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const imgUrl = new URL("../../../public/login-header.png", import.meta.url)
  .href;
const router = useRouter();
const isHaveNum = ref(true);

const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

const routerList = computed(() => {
  return store.state.menu.routerList;
});

// 账号校验规则
const validateUser = (rule, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const reg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    reg.test(value)
      ? callback()
      : callback(new Error("手机号格式不对,请输入正确手机号"));
  }
};

// 密码校验规则
const validatePass = (rule, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/;
    reg.test(value)
      ? callback()
      : callback(new Error("密码格式不对,需要4到16位字母/数字/下划线/减号"));
  }
};
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

const codeShowInfo = reactive({
  text: "发送验证码",
  second: 5,
});

let isCodeClick = false;
const sendCodeClick = () => {
  if (isCodeClick) return;
  // 手机号正则
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  // 判断手机号是否正确
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  const sccInterval = setInterval(() => {
    if (codeShowInfo.second <= 0) {
      codeShowInfo.text = "发送验证码";
      codeShowInfo.second = 5;
      clearInterval(sccInterval);
      isCodeClick = false;
    } else {
      codeShowInfo.text = `剩余 ${codeShowInfo.second} s`;
      codeShowInfo.second -= 1;
    }
  }, 1000);
  isCodeClick = true;
  getCode({ tel: loginForm.userName }).then((res) => {
    console.log(res.data);
    if (res.data.code === 10000) {
      ElMessage.success("发送成功！");
    }
  });
};

const loginFormRef = ref();

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (isHaveNum.value) {
        login(loginForm).then(({ data }) => {
          console.log(data);
          if (data.code === 10000) {
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "userInfo",
              JSON.stringify(data.data.userInfo)
            );
            router.push("/");
            menuPermissions().then(({ data }) => {
              store.commit("dynamicMenu", data.data);
              // console.log("routerList", routerList.value);
              toRaw(routerList.value).forEach((e) => {
                console.log(e);
                router.addRoute("main", e);
              });
            });
          }
        });
      } else {
        authentication(loginForm).then((res) => {
          console.log(res);
          let data = res.data;
          if (data.code === 10000) {
            isHaveNum.value = true;
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
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
