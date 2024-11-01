<template>
   <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
   
      <el-form-item label="旧密码" prop="oldPassword">
         <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
      </el-form-item>
      
      <el-form-item label="新密码" prop="newPassword">
         <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
         <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <p style="font-size:15px;color:orange">*密码必须同时包含大、小写字母，数字和特殊字符且长度不低于8位*</p>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<script setup>
import {updateDlmm} from "../../../../api/login";
import {reactive, ref} from "vue";
import {encrypt} from "../../../../utils/jsencrypt";
import {ElMessage} from "element-plus";



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
const rules = ref({
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [{ required: true, message: "新密码不能为空", trigger: "blur" }, { min: 8, max: 30, message: "长度在 8 到 30 个字符", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "确认密码不能为空", trigger: "blur" }, { required: true, validator: equalToPassword, trigger: "blur" }]
});

/** 提交按钮 */
function submit() {
  const oldDlmm = encrypt(user.oldPassword)
  const newDlmm = encrypt(user.newPassword)

  updateDlmm(oldDlmm,newDlmm).then(response => {
    ElMessage({
      message: response.msg,
      type: "success",
    });
  });
}


/** 关闭按钮 */
function close() {
  
  window.history.go(-1)
  // this.$router.go(-1)
  // proxy.$tab.closePage();
}
</script>
