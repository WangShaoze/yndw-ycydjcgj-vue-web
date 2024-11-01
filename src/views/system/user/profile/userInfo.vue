<template>
  <div>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="用户名称" prop="czymc">
        <el-input v-model="ruleForm.czymc" />
      </el-form-item>
      <el-form-item label="手机号码" prop="sjhm">
        <el-input v-model="ruleForm.sjhm" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="ruleForm.xbdm">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(ruleForm)">保存</el-button>
        <el-button @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getInfo ,saveOrUpdate} from "../../../../api/login"
import {ElMessage} from "element-plus";


const ruleFormRef = ref<FormInstance>()

const ruleForm = ref({
  czymc: '',
  sjhm: '',
  email: '',
  xbdm:''
})

//获取操作员
function getUser(){
  getInfo().then(res => {
    ruleForm.value = res.data
  })
}
getUser()


function checkMobile(rules,value,callback) {
  const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if(regMobile.test(value)){
    return callback()
  }
  callback(new Error('请输入合法的手机号'))
}

function checkEmail(rules,value,callback) {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if(regEmail.test(value)){
    return callback()
  }
  callback(new Error('请输入合法的邮箱地址'))
}


const rules = reactive<FormRules>({
  czymc: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名的长度在 3 - 10个字符之间', trigger: 'blur'}

  ],
  sjhm: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ],
  email:[
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ]
})

//定义新的对象
const userData = ref({})
const emit = defineEmits(["submit"])

const submit = (ruleForm) => {
  //修改
  saveOrUpdate(ruleForm).then(res => {
    ElMessage({
      message:res.msg,
      grouping: true,
      type: 'success',
    })
    //修改完成后重新获取操作员
    getInfo().then(res => {
      userData.value = res.data
      emit("submit",res.data)
    })
  })

}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
/** 关闭按钮 */
function close() {
  window.history.go(-1)
  // this.$router.go(-1)
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
</script>
