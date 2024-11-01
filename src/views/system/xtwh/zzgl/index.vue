<template>

  <el-row>
    <el-col :span="24">
  <el-card :style="tableCardStyle">
    <!-- 设置间距，row和table之间 -->
    <fieldset style="border: 1px solid #dcdfe6; padding: 20px">
      <!-- <legend>搜索信息</legend> -->
      <legend>新增</legend>
      <el-row :gutter="20" class="header">
        <!-- <el-col :span="7">
          <el-input
            placeholder="请输入关键字"
            v-model="serachWord"
          ></el-input>
        </el-col>
        <el-button type="primary" 
          :icon="Search" 
          color="#626aef"
          @click="initZzgl"
          >搜索</el-button
        > -->
        <el-button
          type="primary"
          :icon="CirclePlus"
          @click="handleDialogValue()"
        >
          添加</el-button
        >
      </el-row>
    </fieldset>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; padding-top: 20px"
      border
      row-key="bh"
      default-expand-all
      :tree-props="{ children: 'children' }"
      lazy
    >
      <el-table-column
        :width="item.width"
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in options"
        :key="index"
      >
        <template #default="{ row }" v-if="item.prop === 'dwbz'">
          <el-button
            :type="row.dwbz == 2 ? 'primary' : 'danger'"
            size="small"
            plain
            >{{ row.dwbzStr }}</el-button
          >
        </template>

        <template #default="{ row }" v-else-if="item.prop === 'zzztdm'">
          <el-switch
            v-model="row.zzztdm"
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

        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="small"
            @click="handleDialogValue(row, 1)"
            >添加下级</el-button
          >
          <el-button size="small" @click="handleDialogValue(row)"
            >编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteZz(row.bh)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
    </el-col>
  </el-row>

  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogVisible"
    :dialogTableValue="dialogTableValue"
    @initZzgl="initZzgl"
  />
</template>

<script setup>
import { getZzglList, changeStatusApi, deleteZzxxApi } from "@/api/zhgl/zzgl";
import { options } from "./options";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./dialog.vue";
import { isNull, beTree } from "./filters";
import {
  Search,
  Edit,
  Setting,
  Delete,
  CirclePlus,
} from "@element-plus/icons-vue";
const tableData = ref([]);
const oepn = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref();
const dialogTableValue = ref({});
const serachWord = ref('');
const initZzgl = async () => {
  const res = await getZzglList();
  // tableData.value = beTree(res.data);
  tableData.value = res.data;
};
let tableCardStyle = ref({
  height: window.innerHeight -100 +'px',
  'overflow-y':'auto',
  'overflow-x':'auto'
})
let max_height = window.innerHeight - 800
initZzgl()
 window.addEventListener('resize', () => {
  tableCardStyle.value={
    height: window.innerHeight -100 +'px',
    'overflow-y':'auto',
    'overflow-x':'auto'
  }
 }
 )
const changeStatus = async (row) => {
  const res = await changeStatusApi(row);
  ElMessage({
    message: res.msg,
    type: "success",
  });
};

// 添加新的、编辑
const handleDialogValue = (row, data) => {
  if (isNull(row)) {
    // 如果是空的话说明是新增
    dialogVisible.value = true;
    dialogTitle.value = "添加组织";
    dialogTableValue.value = { bh: "" }; //设置为空，dialogTableValue
  } else if (!isNull(row) && !isNull(data)) {
    dialogVisible.value = true;
    dialogTitle.value = "添加下级";
    dialogTableValue.value = { bh: "", sjbh: `${row.bh}` }; //这里的上级编号应该是自己
  } else {
    dialogVisible.value = true;
    dialogTitle.value = "编辑信息";
    dialogTableValue.value = JSON.parse(JSON.stringify(row));
  }
};

// 删除组织信息
const deleteZz = (bh) => {
  ElMessageBox.confirm("您确定要删除吗?", "提示", {
    confirmButtonText: "",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteZzxxApi(bh).then((res) => {
        initZzgl();
        ElMessage({
          type: "success ",
          message: res.msg,
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}
</style>
