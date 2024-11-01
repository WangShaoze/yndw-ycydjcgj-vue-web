<template>
  <el-row>
    <el-card class="box-card" :style="tableCardStyle" >
      <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
        <fieldset style="border: 1px solid #dcdfe6; padding: 30px">
          <legend>搜索信息</legend>
          <div class="div1">
            名称:
            <el-input
                v-model="queryForm.fjmc"
                input-style="width: 300px;"
                placeholder="请输入名称"
                clearable
            />
            <el-button
                icon="Search"
                round
                class="btn-seach"
                style="margin-left:20px;margin-bottom: 5px;"
                @click="search"
            >
              搜索
            </el-button>
          </div>
        </fieldset>
        <!--表格-->
        <el-table :data="tableData" border style="width: 100%; margin-top: 20px" id="vcfResult">
          <el-table-column type="index" align = "center" />
          <el-table-column label="名称" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.fjmc }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="路径" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.fjlj }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="大小" :formatter="formatter">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ formatter(scope.row.fjdx) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="存储路径" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.fjcclj }}</span>
              </div>
            </template>
          </el-table-column>
          <!--             时间格式为：yyyy-MM-dd HH:mm:ss.SSS-->
          <el-table-column label="上传时间"  :formatter="formatterDate">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ formatterDate(scope.row.cjsj) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align = "center" width="260">
            <template #default="scope">
              <el-button type="danger" plain @click="deleteFile(scope.row)">删除</el-button>
              <el-button type="warning" plain @click="downloadFile(scope.row)">下载</el-button>
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
import { ref} from "vue";
import { getDataList , deleteBh , downloadBh , uploadFile } from '../api/wjzx' ;
import { ElMessage ,UploadProps, UploadUserFile,ElDialog} from 'element-plus';
import {ElMessageBox} from "element-plus/es";
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

//文件大小格式化
const formatter = (row, column) => {
  if (row < 1024) {
    return row + 'B';
  } else if (row < 1024 * 1024) {
    let temp = (row / 1024).toFixed(2)  + 'KB';
    return temp;
  } else if (row < 1024 * 1024 * 1024) {
    let temp = (row / (1024 * 1024)).toFixed(2)  + 'MB';
    return temp;
  } else {
    let temp = (row / (1024 * 1024 * 1024)).toFixed(2)+ 'GB';
    return temp ;
  }

}

// 分页以及搜索条件
const queryForm = ref({
  fjmc: "", // 搜索条件
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
  fjmc:""
})


//处理时间格式化
const formatterDate = (row) => {
  if (row == null) {
    return "";
  }
  let date = new Date(row);
  let y = date.getFullYear();
  let m: string | number = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d: string | number = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h: string | number = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute: string | number = date.getMinutes();
  let second: string | number = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

//查询
const search = () => {
  param.value.fjmc = queryForm.value.fjmc
  tableRefulsh()
}
//删除
const deleteFile = (row) => {
  ElMessageBox.confirm(
      '确定是否删除',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        deleteBh(row.bh).then(res => {
          ElMessage({
            message: res.msg,
            grouping: true,
            type: 'success',
          })
          queryForm.value.fjmc= param.value.fjmc
          tableRefulsh()
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

//文件下载
const downloadFile = (row) => {
  downloadBh(row.bh).then(res => {
    let fileName = row.fjmc
    //文件流转码全部文件格式
    let blob = new Blob([res], {type: 'application/octet-stream'})
    let downloadElement = document.createElement("a");
    if ("download" in document.createElement("a")) {
      // 不是IE浏览器
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 释放掉blob对象
    } else {
      // IE 10+
      window.navigator.msSaveBlob(blob, fileName);
    }
  })
}
//分页
const handleSizeChange = (pagesize) => {
  queryForm.value.pagenum = 1;
  queryForm.value.pagesize = pagesize;
  initCzyxx();
};

const handleCurrentChange = (pagenum) => {
  queryForm.value.pagenum = pagenum;
  initCzyxx();
};

const initCzyxx = async () => {
  const res = await getDataList(queryForm.value);
  tableData.value = res.data;
  total.value = res.count;
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

/* .el-input, .el-input--default {
  height: 50px;
} */

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>