<template>
   <div class="app-container">
      <el-row>
         <el-col :span="6">
            <el-card class="box-card" style="height: 480px;">
               <template v-slot:header>
                  <div class="clearfix">
                     <span style="color: #FFF;">个人信息</span>
                  </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar :user="state.user" />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="user" />用户名称
                        <div class="pull-right">{{ state.user.czymc }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="phone" />手机号码
                        <div class="pull-right">{{ state.user.sjhm }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="email" />用户邮箱
                        <div class="pull-right">{{ state.user.email }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />所属部门
                        <div class="pull-right">{{ state.user.dw }} </div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="peoples" />所属角色
                        <div class="pull-right">{{ state.user.gwmc }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="date" />创建日期
                        <div class="pull-right" v-if="state.user.cjsj">{{ state.user.cjsj.substring(0, 10) }}</div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>

         <el-col :span="18">
         <div style=" ;margin-left: 30px; ">
            <el-card style="height: 480px;">
               <template v-slot:header>
               <div class="clearfix">
                 <span style="color: #FFF;">信息修改</span>
               </div>
             </template>
             <el-tabs v-model="activeTab">
               <el-tab-pane label="基本资料" name="userinfo">
                 <user-info @submit="submit"/>
               </el-tab-pane>
               <el-tab-pane label="修改密码" name="resetPwd">
                 <reset-pwd :user="state.user" />
               </el-tab-pane>
             </el-tabs>
            </el-card>
         </div>
         </el-col>
      </el-row>
   </div>
</template>

<script setup lang="ts">
import plan from "./progress"
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getInfo } from "../../../../api/login"
import {reactive, ref} from 'vue'
import type { TabsPaneContext } from 'element-plus'
import UserInfo from "./userInfo.vue";
import ResetPwd from "./resetPwd.vue";


function  submit(val){
  state.user = val
}

//标签页
const activeName = ref('0')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.index
}

const activeTab = ref("userinfo");
const state = reactive({
   user: {},
   roleGroup: {},
   postGroup: {}
});


</script>
<style lang="scss" scoped>
:deep(.el-card__header) {
   background-color: #01357A;
}

.row {
   display: flex;
}
</style>
