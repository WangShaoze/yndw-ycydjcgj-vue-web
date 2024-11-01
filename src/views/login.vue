<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">烟草局用电情况检测小工具</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码">
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="validCode" v-if="captchaOnOff">
        <el-input v-model="loginForm.validCode" size="large" auto-complete="off" placeholder="验证码" style="width: 63%"
                  v-on:keydown.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon"/>
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer"></div>
  </div>
</template>

<script setup>
import {login, getCodeImg} from "@/api/login";
import {encrypt} from "@/utils/jsencrypt";

import {uuid} from "vue-uuid";
import {putJsonData} from "@/utils/storageUtils";
import {ElMessage} from "element-plus";
// import router from '@/router/index.js'
// import { useRoute, useRouter } from 'vue-router'

const store = useStore();
const $router = useRouter();
const {proxy} = getCurrentInstance();

const loginForm = ref({
  username: "ycydjcgjgly",
  password: "admin@Passw0rd",
  validCode: "",
  deviceId: "",
  grant_type: "password_code",
});

const loginRules = {
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  validCode: [{required: true, trigger: "change", message: "请输入验证码"}],
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      var loginData = {
        username: encrypt(loginForm.value.username),
        password: encrypt(loginForm.value.password),
        validCode: loginForm.value.validCode,
        deviceId: loginForm.value.deviceId,
        grant_type: "password_code",
      };
      store
          .dispatch("Login", loginData)
          .then(() => {
            ElMessage({
              message: "登录成功",
              type: 'success',
              duration: 1 * 1000
            })
            $router.push({path: redirect.value || "/index"});
          })
          .catch((err) => {
            loading.value = false;
            // 重新获取验证码
            if (captchaOnOff.value) {
              getCode();
            }
          });
    }
  });
}

function getCode() {
  loginForm.value.deviceId = uuid.v1();
  getCodeImg(loginForm.value.deviceId).then((res) => {
    codeUrl.value = window.URL.createObjectURL(res);
  });
}

getCode();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>