<template>
  <el-row>
    <el-card class="box-card" :style="tableCardStyle" >
      <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
        <fieldset style="border: 1px solid #dcdfe6; padding: 30px">
          <legend>搜索信息</legend>
          <div class="div1">
            查询条件:
            <el-input
              v-model="queryForm.applicationName"
              input-style="width: 300px;"
              placeholder="请输入服务名称"
              clearable
            />
            登陆时间:
            <el-date-picker
              v-model="queryForm.timestamp"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss"
              input-style="width: 300px;"
            >
            </el-date-picker>
            <el-button
              icon="Search"
              round
              class="btn-seach"
              style="margin-left:20px"
              @click="SeachClick"
            >
              搜索
            </el-button>
            <el-button
              icon="Download"
              round
              class="btn-seach"
              style="margin-left:20px"
              @click="exportBtn"
            >
              导出
            </el-button>
          </div>
        </fieldset>
        <!--表格-->
        <el-table :data="tableData" border style="width: 100%; margin-top: 20px" id="vcfResult">
          <el-table-column type="index" align = "center" />
            <el-table-column label="服务名称" >
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span style="margin-left: 10px">{{ scope.row.applicationName }}</span>
                </div>
              </template>
            </el-table-column>
          <el-table-column label="类名" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.className }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="方法" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.methodName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作员" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作说明" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.operation }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.timestamp }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:page-size="queryForm.pagesize"
            :page-sizes="[10, 20, 30, 50]"
            :small="true"
            :disabled="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            style="float: right"
        />
      </div>
    </el-card>
  </el-row>
</template>

<script lang="ts" setup>
import {ref, UnwrapRef} from "vue";
import { ElMessage } from 'element-plus';
import { getDataList , exportExcel } from '../api/ywrz' ;
import theme from "echarts/types/src/theme/dark";
//表格数据
const tableData = ref([])

let treeCardStyle = ref({
  height: window.innerHeight -120 +'px',
  'margin-top': '15px',
  'margin-rignt': '20px',
  'margin-buttom': '15px',
  'margin-left': '20px',
  'overflow-y':'auto',
  'overflow-x':'auto'
})
let tableCardStyle= ref({
  height: window.innerHeight -120 +'px',
  width: '98%',
  'margin-top': '15px',
  'margin-rignt': '20px',
  'margin-buttom': '15px',
  'margin-left': '20px',
  'overflow-y':'auto',
  'overflow-x':'auto'
})
window.addEventListener('resize', () => {
  treeCardStyle.value={
    height: window.innerHeight -120 +'px',
    'margin-top': '15px',
    'margin-rignt': '20px',
    'margin-buttom': '15px',
    'margin-left': '20px',
    'overflow-y':'auto',
    'overflow-x':'auto'
  }
  tableCardStyle.value={
    height: window.innerHeight -120 +'px',
    width: '98%',
    'margin-top': '15px',
    'margin-rignt': '20px',
    'margin-buttom': '15px',
    'margin-left': '20px',
    'overflow-y':'auto',
    'overflow-x':'auto'
  }
});
// 分页以及搜索条件
const queryForm = ref({
  Keyword: '',
  applicationName:"",
  timestamp: "", // 搜索条件
  pagenum: 1,
  pagesize: 10,
});
//总条数
const total = ref(0)
//获取表格数据
function tableRefulsh(){
  getDataList(queryForm.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })
}
tableRefulsh()
//查询条件
const param = ref({
  Keyword: "",
  timestamp: "", // 搜索条件
  pagenum: 1,
  pagesize: 10,
});

//搜索
const SeachClick = () => {
  //获取查询条件
  param.value.Keyword = queryForm.value.applicationName;
  if (queryForm.value.timestamp != null && queryForm.value.timestamp != "") {
    param.value.timestamp = queryForm.value.timestamp[0] + ' - ' + queryForm.value.timestamp[1];
  }else {
    param.value.timestamp = "";
  }
  getDataList(param.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })
};



function format (date ,fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

//分页
const handleSizeChange = (pagesize) => {
  param.value.pagesize = pagesize
  initCzyxx()
  initCzyxx();
};

const handleCurrentChange = (pagenum) => {
  param.value.pagenum = pagenum
  initCzyxx()
};

const initCzyxx = async () => {
  getDataList(param.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })
};

//导出文件日志
const exportBtn = () => {
  param.value.Keyword = queryForm.value.applicationName;
  if (queryForm.value.timestamp != null && queryForm.value.timestamp != "") {
    param.value.timestamp = queryForm.value.timestamp[0] + " - " + queryForm.value.timestamp[1];
  }else{
    //时间为空，默认下载最新一个月的数据
    param.value.timestamp = format(new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), "yyyy-MM-dd hh:mm:ss.S") + ' - ' + format(new Date(), "yyyy-MM-dd hh:mm:ss.S");
  }
  exportExcel(param.value).then((res) => {
    //文件流转成xlsx文件
    let blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = "业务日志.xlsx"; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  });
};

</script>

<style lang="scss" scoped>
.seach-input {
  height: 30px;
  margin-left: 20px;
}
.btn-seach {
  background-color: #366cb3;
  color: #ffffff;
}
</style>

<style scoped>
.left-dhl /deep/ .el-button {
  padding: 5px 8px;
}
/* 
.el-input, .el-input--default {
  height: 50px;
} */

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>