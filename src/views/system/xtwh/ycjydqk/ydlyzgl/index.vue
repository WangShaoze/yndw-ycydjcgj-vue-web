<template>
  <el-card class="box-card" :style="tableCardStyle">
    <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
      <div class="div1">
        <div style="margin-top: 40px; margin-bottom: 40px">
          <el-text class="mx-1" style="font-size: 22px">月用电量阈值设置</el-text>
        </div>
        <div style="margin-top: 40px; margin-bottom: 40px">
          <el-text class="mx-1" style="font-size: 22px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：维护 2
            个阈值，进行一级预警和二级预警，未达到一级预警值时显示绿色、超过一级预警值而未达到<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二级预警值时显示黄色、过二级预警值时显示红色。二级预警值应大于一级预警值！
          </el-text>
        </div>

        <div style="margin-right: 40px; margin-left: 40px; font-size: 20px">
          一级预警:
          <el-input
              v-model="queryForm.yi_ji_val"
              input-style="width: 300px;"
              style="margin-right:20px"
          />
          <el-tag class="tg-1" size="large">* 用户容量 kW·h</el-tag>
          <el-text class="mx-2" type="primary" style="color: #dd070c">&nbsp;&nbsp;&nbsp;&nbsp;
            注：输入百分比，需大于100%
          </el-text>
        </div>
        <div style="margin-right: 40px; margin-left: 40px; margin-top:40px; font-size: 20px">
          二级预警:
          <el-input
              v-model="queryForm.er_ji_val"
              input-style="width: 300px;"
              style="margin-right:20px"
          />
          <el-tag class="tg-1" size="large">* 用户容量 kW·h</el-tag>
          <el-text class="mx-2" type="primary" style="color: #dd070c">&nbsp;&nbsp;&nbsp;&nbsp;
            注：输入百分比，需大于100%
          </el-text>
        </div>
        <div style=" margin-left: 130px; margin-top: 30px">
          <el-button
              class="btn-save"
              @click="saveOrUpdateClick"
          >
            提交保存
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {updateYuJinZhi, searchYuJinZhi } from "@/api/ydlyzgl/yzgl";
import {ElMessage} from "element-plus";


let treeCardStyle = ref({
  height: window.innerHeight - 120 + 'px',
  'margin-top': '15px',
  'margin-rignt': '20px',
  'margin-buttom': '15px',
  'margin-left': '20px',
  'overflow-y': 'auto',
  'overflow-x': 'auto'
})
let tableCardStyle = ref({
  height: window.innerHeight - 120 + 'px',
  width: '98%',
  'margin-top': '15px',
  'margin-rignt': '20px',
  'margin-buttom': '15px',
  'margin-left': '20px',
  'overflow-y': 'auto',
  'overflow-x': 'auto'
})
window.addEventListener('resize', () => {
  treeCardStyle.value = {
    height: window.innerHeight - 120 + 'px',
    'margin-top': '15px',
    'margin-rignt': '20px',
    'margin-buttom': '15px',
    'margin-left': '20px',
    'overflow-y': 'auto',
    'overflow-x': 'auto'
  }
  tableCardStyle.value = {
    height: window.innerHeight - 120 + 'px',
    width: '98%',
    'margin-top': '15px',
    'margin-rignt': '20px',
    'margin-buttom': '15px',
    'margin-left': '20px',
    'overflow-y': 'auto',
    'overflow-x': 'auto'
  }
});

const yiJiYuJin = ref("")
const erJiYuJin = ref("")


// 搜索条件
const queryForm = ref({
  yi_ji_val: yiJiYuJin,
  er_ji_val: erJiYuJin,
});

// 初始化
const searchYuJinZhiInit = async () => {
  let yuZhiRes = await searchYuJinZhi();
  queryForm.value.yi_ji_val = yuZhiRes.data.yjyjz;
  queryForm.value.er_ji_val = yuZhiRes.data.erjyjz;
}

searchYuJinZhiInit()


// saveOrUpdateClick
const saveOrUpdateClick = async () => {
  let rsl = await updateYuJinZhi(queryForm.value);
  await searchYuJinZhiInit();
  ElMessage({
    message: rsl.msg,
    type: "success",
  });
}
</script>


<style lang="scss" scoped>
.seach-input {
  height: 30px;
  margin-left: 20px;
}

.btn-save {
  background-color: #1e9cf1;
  color: #ffffff;
  width: 120px;
  height: 45px;
  font-size: 20px;
}

.tg-1 {
  background-color: #e8f3e0;
  color: #131212;
  font-size: 20px;
}
</style>


<style scoped>
.left-dhl /deep/ .el-button {
  padding: 5px 8px;
}

.el-input, .el-input--default {
  height: 50px;
}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>