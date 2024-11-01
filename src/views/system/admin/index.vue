<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>烟草局用电情况检测小工具</h2>
        <p>
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>Spring Cloud</li>
              <li>Spring Boot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis Plus</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />


    <!--    强制改密-->
    <el-dialog v-model="editPasswordVisible" title="修改密码" width="30%"
               :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" :show-close="false">
      <el-form ref="pwdRef" :model="user" :rules="rulesPassword" class="qzgm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script setup name="adminIndex">
import {encrypt} from "@/utils/jsencrypt";

import {useRouter} from "vue-router";

const version = ref('0.2.0')
import {getInfo, updateDlmm} from '@/api/login.js'
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";
import {checkDefaultDlmm, selectCzyxxBYZzbh} from "@/api/czyxx.js"
getInfo()


//修改密码弹框
const editPasswordVisible = ref(false)

const router = useRouter();

//判断密码是否更改过
function checkPassword() {
  checkDefaultDlmm().then((res) => {
    if (res.data == true) {
      editPasswordVisible.value = true
    }
  })
}

checkPassword()

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
});

const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rulesPassword = ref({
  oldPassword: [{required: true, message: "旧密码不能为空", trigger: "blur"}],
  newPassword: [{required: true, message: "新密码不能为空", trigger: "blur"}, {
    min: 6,
    max: 20,
    message: "长度在 6 到 20 个字符",
    trigger: "blur"
  }],
  confirmPassword: [{required: true, message: "确认密码不能为空", trigger: "blur"}, {
    required: true,
    validator: equalToPassword,
    trigger: "blur"
  }]
});

/** 提交按钮 */
function submit() {
  const oldDlmm = encrypt(user.oldPassword)
  const newDlmm = encrypt(user.newPassword)

  updateDlmm(oldDlmm, newDlmm).then((res) => {
    console.log("按钮事件", res)
    if (res.msg == "更新操作员密码成功") {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      editPasswordVisible.value = false
      console.log("准备跳转")
      router.push({ path: "/login" });
    }
  });
}

</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

