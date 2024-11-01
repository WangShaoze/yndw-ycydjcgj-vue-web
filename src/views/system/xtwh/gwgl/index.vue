<template>
  <el-row>
    <el-col :span="6">
      <el-card class="box-card" :style="treeCardStyle" >
        <el-button icon="Refresh" class="btn-seach" @click="Refresh">
          刷新
        </el-button>

        <div style="magrin-top: 30px">
          <el-tree
            :data="dataTree"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </div>
      </el-card>
    </el-col>

    <el-col :span="18">
      <el-card class="box-card" :style="tableCardStyle" >
      <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
        <fieldset style="border: 1px solid #dcdfe6; padding: 30px">
          <legend>搜索信息</legend>
          <div class="div1">
            名称:
            <el-input
              v-model="queryForm.gwmc"
              input-style="width: 300px;"
              placeholder="请输入名称"
            />
            <el-button
              icon="Search"
              round
              class="btn-seach"
              @click="handleNodeClick"
              style="margin-left:20px"
            >
              搜索
            </el-button>
            <el-button
              icon="plus"
              round
              class="btn-seach"
              @click="dialogTitle='添加岗位', addGwxx()"
            >
              添加
            </el-button>
          </div>
        </fieldset>

        <el-table :data="gwxx" border style="width: 100%; margin-top: 20px">
          <el-table-column type="index" align = "center" />
          <el-table-column prop="gwmc" label="岗位名称" />
          <el-table-column prop="gwytdm" label="岗位用途" />
          <el-table-column prop="gwztdm" label="状态" width="180" align = "center">
            <template #default="{ row }">
              <el-switch
                v-model="row.gwztdm"
                @change="changeStatus(row)"
                active-value="1"
                inactive-value="0"
                active-text="正常"
                inactive-text="禁用"
                inline-prompt
                size="large"
                width="60"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align = "center">
            <template #default="{ row }">
              <el-button
                type="xg"
                size="small"
                plain
                @click="updataGwxx(row)"
                >修改</el-button
              >
              <el-button type="danger" size="small" @click="remove(row.bh)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="queryForm.pagenum"
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
    </el-col>
  </el-row>

  <el-dialog
    :title="title"
    width="40%"
    draggable
    v-model="dialogFormVisible"
    @close="handleclose"
  >
    <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
      <el-form-item label="组织信息">
        <el-tree-select
          v-model="form.zzbh"
          :data="dataTreeDialog"
          check-strictly="true"
          default-expand-all
          :props="defaultProps1"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="gwmc">
        <el-input v-model="form.gwmc" />
      </el-form-item>
      <el-form-item label="岗位描述" prop="gwms">
        <el-input v-model="form.gwms" />
      </el-form-item>
      <el-form-item label="岗位用途" prop="gwytdm">
        <el-input v-model="form.gwytdm" />
      </el-form-item>
      <el-form-item label="状态" prop="gwztdm">
        <el-radio-group v-model="form.gwztdm" class="ml-4">
          <el-radio label="1" size="small">正常</el-radio>
          <el-radio label="2" size="small">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleclose">取消</el-button>
        <el-button type="primary" @click="handleConfirm()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  getGwglList,
  changeStatusApi,
  getGwglListPage,
  removeGwxx,
  saveOrUpdateApi,
} from "@/api/zhgl/gwgl";
import { beTree } from "./filters";
import { dateFtt } from "./time";
import { ElMessage, ElMessageBox } from "element-plus";
import { getZzglList, getZzxxBybhApi } from "@/api/zhgl/zzgl";
import { da } from "element-plus/lib/locale";
import type { FormInstance, FormRules } from "element-plus";

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


const defaultProps = {
  children: "children",
  label: "zzmc",
};
const defaultProps1 = {
  value: "bh",
  label: "zzmc",
  children: "children",
};
// 分页以及搜索条件
const queryForm = ref({
  zzbh: "", // 搜索条件
  gwmc: "",
  pagenum: 1,
  pagesize: 10,
});

const formRef = ref(null);
const title = ref("新增岗位");
const total = ref(0);
const gwxx = ref([]);
const initGwxx = async () => {
  const res = await getGwglListPage(queryForm.value);
  total.value = res.count;
  gwxx.value = res.data;
};
// initGwxx();

//弹出对话框
const dialogFormVisible = ref(false);
//定义表单
const form = ref({
  bh: "",
  zzmc: "",
  zzbh: "",
  gwmc: "",
  gwms: "",
  gwytdm: "",
  gwztdm: "",
});
// //弹出层提交表单(添加或者修改)
// const handleConfirm = async () => {
//   const res = await saveOrUpdateApi(form.value);
//   dialogFormVisible.value = false;
//   if (res.msg == "添加岗位成功" || res.msg == "修改岗位成功") {
//     ElMessage({
//       message: res.msg,
//       type: "success",
//     });
//   }
// };

//From表单校验
const rules: FormRules = {
  gwmc: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { max: 200, message: '长度不超200 个字符', trigger: 'blur' },
  ],
  gwms: [
    { max: 500, message: '长度不超过500 个字符', trigger: 'blur' }
  ],
  gwytdm: [
    {max: 8, message: '长度不超过8 个字符', trigger: 'blur' }
  ],
  gwztdm: [
    { required: true, message: '请选择状态', trigger: 'blur' },
    {max: 8, message: '长度不超过8 个字符', trigger: 'blur' }
  ],
};


//提交表单并判断
const  handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdateApi(form.value).then((res) => {
        handleclose();
        initGwxx();
        ElMessage({
          message: res.msg,
          type: "success",
        });
      });
    } else {
      return false;
    }
  });
};
//定义添加岗位方法
const addGwxx = async () => {
  dialogFormVisible.value = true;
  title.value = "新增岗位";
  let res = await getZzglList();
  dataTreeDialog.value = res.data;
  if(form.value.zzbh.length == 0){
    form.value.zzbh = res.data[0].bh
  }
};
const updataGwxx = async (row) => {
  dialogFormVisible.value = true;
  title.value = "修改岗位";
  let res = await getZzglList();
  dataTreeDialog.value = res.data;
  form.value = row;
};
// 格式化时间
const formatDate = (row, column, cellValue, index) => {
  const d = new Date(cellValue);
  return dateFtt("yyyy-MM-dd hh:mm:ss", d);
};
//修改状态
const changeStatus = async (row) => {
  const res = await changeStatusApi(row);
  ElMessage({
    message: res.msg,
    type: "success",
  });
  initGwxx();
};

//定义左侧树形结构
const dataTree = ref([]);
//定义dialog表单树结构
const dataTreeDialog = ref([]);
//初始化树
const initTree = async () => {
  const res = await getZzglList();
  dataTree.value = res.data;
  queryForm.value.zzbh = res.data[0].bh
  let gwRes = await getGwglListPage(queryForm.value);
  total.value = gwRes.count;
  gwxx.value = gwRes.data;
};
initTree();
//点击节点对应表格刷新
const handleNodeClick = async (treeNode) => {
  if (treeNode) {
    queryForm.value.zzbh = treeNode.bh;
    form.value.zzbh = treeNode.bh;
  }
  let res = await getGwglListPage(queryForm.value);
  total.value = res.count;
  gwxx.value = res.data;
};

//刷新
const Refresh = async () => {
  initTree();
};
// 分页处理
const handleSizeChange = (pagesize) => {
  queryForm.value.pagenum = 1;
  queryForm.value.pagesize = pagesize;
  initGwxx();
};
const handleCurrentChange = (pagenum) => {
  queryForm.value.pagenum = pagenum;
  initGwxx();
};
// 删除方法
const remove = (id) => {
  ElMessageBox.confirm("您确定要删除吗?", "提示", {
    confirmButtonText: "",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await removeGwxx(id);
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      initGwxx();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};
//
const handleclose = () => {
  dialogFormVisible.value = false;
  form.value = {};
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