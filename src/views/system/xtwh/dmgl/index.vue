<template>
  <el-row>
    <el-col :span="6" min-width="150px">
      <el-card :style="buttonCardStyle" ref="buttonCard">
        <fieldset style="border: 1px solid #dcdfe6">
          <legend>搜索信息</legend>
          <el-row>
            <div class="div1">
              <el-input
                input-style="width: 100px;"
                placeholder="代码分类"
                v-model="queryParma.dmflmc"
                v-on:keydown.enter="initDmflList"
                clearable
              />
              <el-button
                icon="Search"
                round
                style="margin-left: 20px"
                @click="initDmflList"
              >
                搜索
              </el-button>
            </div>
          </el-row>

          <el-divider />

          <el-row>
            <div class="div1">
              <el-button
                icon="plus"
                round
                class="btn-seach"
                @click="
                  (dialogFormVisible = true),
                    (dialogTitle = '添加代码分类'),
                    addDmflInit()
                "
              >
                添加
              </el-button>
              <el-button icon="edit" type="warning" round @click="updateDmfl()">
                修改
              </el-button>
              <el-button
                icon="delete"
                type="danger"
                round
                @click="deleteDmfl()"
              >
                删除
              </el-button>
            </div>
          </el-row>
        </fieldset>
      </el-card>
      <el-card class="box-card" :style="treeCardStyle">
        <div style="height: 580px">
          <el-table
            :data="dmfllist"
            border
            row-key="bh"
            style="width: 100%"
            @row-click="rowclick"
            :highlight-current-row="yskz"
          >
            <el-table-column label="代码分类名称" prop="dmflmc">
              <template #default="scope" >
                 {{ scope.row.dmflmc }}
                <el-icon style="float: right">
                  <ArrowRight />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="18">
      <el-card class="box-card" :style="tableCardStyle">
        <div>
          <fieldset style="border: 1px solid #dcdfe6; padding: 20px">
            <legend>操作信息</legend>
            <div class="div1">
              <el-button
                icon="plus"
                round
                class="btn-seach"
                @click="(open = true), clearaForm()"
              >
                添加
              </el-button>
            </div>
          </fieldset>
          <el-table
            :data="dmflmxlist"
            border
            row-key="bh"
            style="width: 100%; margin-top: 20px"
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column label="代码分类编码" prop="dmflbm">
            </el-table-column>
            <el-table-column label="代码名称" prop="dmmc"> </el-table-column>
            <el-table-column label="代码编码" prop="dmbm"> </el-table-column>
            <el-table-column
              prop="ztdm"
              label="状态"
              width="180"
              align="center"
            >
              <template #default="{ row }">
                <el-switch
                  v-model="row.ztdm"
                  @change="updateDmztdm(row)"
                  active-value="0"
                  inactive-value="1"
                  active-text="正常"
                  inactive-text="禁用"
                  inline-prompt
                  size="large"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="(open = true), insXjdm(row)"
                  >添加下级</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  plain
                  @click="(open = true), updataDmmx(row)"
                  >修改</el-button
                >
                <el-button type="danger" size="small" @click="deleteDm(row.bh)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 代码分类弹出层表单 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="dialogTitle"
    width="40%"
    center
    draggable
  >
    <el-form
      ref="formRef"
      :model="dmflForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      label-position="right"
    >
      <el-row :gutter="24">
        <el-col :span="12" :offset="6">
          <el-form-item label="代码分类编码" label-width="110px" prop="dmflbm">
            <el-input v-model="dmflForm.dmflbm" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12" :offset="6">
          <el-form-item label="代码分类名称" label-width="110px" prop="dmflmc">
            <el-input v-model="dmflForm.dmflmc" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12" :offset="6">
          <el-form-item label="状态" prop="ztdm" label-width="100px">
            <el-radio-group v-model="dmflForm.ztdm">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 弹窗底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmitDmfl">保存</el-button>
        <el-button @click="(dialogFormVisible = false), resetFormDmfl()"
          >取消</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 代码弹出层表单 -->
  <el-dialog v-model="open" :title="title" width="40%" center draggable>
    <el-form
       ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      label-position="right"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="上级代码" label-width="100px" prop="dmflbm">
            <el-tree-select
              v-model="form.dmflbm"
              :data="dmfllist"
              :props="props"
              default-expand-all
              check-strictly
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="代码编码" label-width="100px" prop="dmbm">
            <el-input v-model="form.dmbm" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="代码名称" label-width="100px" prop="dmmc">
            <el-input v-model="form.dmmc" autocomplete="off" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示顺序号" label-width="100px" prop="xssxh">
            <el-input-number
              v-model="form.xssxh"
              autocomplete="off"
              style="width: 100%"
              :min="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 弹窗底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="open = false ">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue-demi";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  dmflList,
  dmflmxList,
  updateZtdm,
  saveOrUpdate,
  saveOrUpdateDmfl,
  deleteDmflByBh,
  deleteDmByBh,
} from "../api/dmgl";
//规则判断
const formRef = ref(null);
// 代码分类列表
const dmfllist = ref([]);
// 代码分类明细列表
const dmflmxlist = ref([]);
// 代码分类编码
const dmflbm = ref();
//当前代码分类编号
const currentDmflbm = ref();
// 信息表单
const queryParma = reactive({
  dmflmc: "",
});
const yskz = ref(false);
// 信息表单
const form = reactive({
  bh: "",
  sjbh: "",
  dmflbm: "",
  dmmc: "",
  dmbm: "",
  xssxh: "1",
  ztdm: "0",
  ztdmStr: "未知",
});

// 信息表单
const dmflForm = reactive({
  bh: "",
  dmflbm: "",
  dmflmc: "",
  dmlb: "1",
  ztdm: "",
  ztdmStr: "未知",
});

// 弹窗标题
const dialogTitle = ref();
const title = ref();

// 弹窗显隐控制
const dialogFormVisible = ref(false);
const open = ref(false);

// 响应结果
const responsResult = ref(false);

let buttonCardStyle = ref({
  "margin-top": "15px",
  "margin-rignt": "20px",
  "margin-left": "20px",
  "overflow-y": "auto",
  "overflow-x": "auto",
});
let treeCardStyle = ref({
  height: window.innerHeight - 325 + "px",
  "margin-top": "15px",
  "margin-rignt": "20px",
  "margin-buttom": "15px",
  "margin-left": "20px",
  "overflow-y": "auto",
  "overflow-x": "auto",
});
let tableCardStyle = ref({
  height: window.innerHeight - 120 + "px",
  width: "98%",
  "margin-top": "15px",
  "margin-rignt": "20px",
  "margin-buttom": "15px",
  "margin-left": "20px",
  "overflow-y": "auto",
  "overflow-x": "auto",
});
window.addEventListener("resize", () => {
  buttonCardStyle.value = {
    "margin-top": "15px",
    "margin-rignt": "20px",
    "margin-left": "20px",
    "overflow-y": "auto",
    "overflow-x": "auto",
  };

  treeCardStyle.value = {
    height: window.innerHeight - 325 + "px",
    "margin-top": "15px",
    "margin-rignt": "20px",
    "margin-buttom": "15px",
    "margin-left": "20px",
    "overflow-y": "auto",
    "overflow-x": "auto",
  };
  tableCardStyle.value = {
    height: window.innerHeight - 120 + "px",
    width: "98%",
    "margin-top": "15px",
    "margin-rignt": "20px",
    "margin-buttom": "15px",
    "margin-left": "20px",
    "overflow-y": "auto",
    "overflow-x": "auto",
  };
});

function addDmflInit() {
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.dmlb = "1";
  dmflForm.ztdm = "0";
  dmflForm.ztdmStr = "未知";
  dialogTitle.value = "新增代码分类";
  dialogFormVisible.value = true;
}

function deleteDmfl() {
  if (!dmflForm.bh) {
    ElMessage({
      message: "请先选择代码分类",
      grouping: true,
      type: "warning",
    });
  } else {
    ElMessageBox.confirm("确定是否删除", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteDmflByBh(dmflForm.bh).then((res) => {
          ElMessage({
            message: res.msg,
            grouping: true,
            type: "success",
          });
          initDmflList();
        });
      })
      .catch(() => {
        ElMessage({
          message: "已取消删除",
          grouping: true,
          type: "info",
        });
      });
  }
}

function initDmflList() {
  dmflList(queryParma.dmflmc).then((res) => {
    if (res.data.length > 0) {
      dmfllist.value = res.data;
      dmflbm.value = res.data[0].dmflbm;
      currentDmflbm.value = res.data[0].dmflbm;
      dmflmxList(dmflbm.value).then((res) => {
        dmflmxlist.value = treeto(res.data);
      });
    } else {
      dmfllist.value = [];
      dmflmxlist.value = [];
    }
  });
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.ztdm = "";
}

initDmflList();

function initDmList(dmflbm) {
  dmflmxList(dmflbm).then((res) => {
    dmflmxlist.value = treeto(res.data);
  });
}

function rowclick(row, event, column) {
  currentDmflbm.value = row.dmflbm;
  dmflForm.bh = row.bh;
  dmflForm.dmflbm = row.dmflbm;
  dmflForm.dmflmc = row.dmflmc;
  dmflForm.ztdm = row.ztdm;
  dmflForm.dmlb = row.dmlb;
  // 更新代码分类编号
  dmflbm.value = row.dmflbm;
  initDmList(currentDmflbm.value);
  yskz.value=true;
}
// 将数组数据转换为树型数据
function treeto(list) {
  let data = list.filter((father) => {
    let branchArr = list.filter((child) => child.sjbh == father.bh); //返回每一项的子级数组
    branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
    return father.sjbh == 0; //返回第一层
  });
  return data;
}

//修改代码分类
function updateDmfl() {
  if (dmflForm.bh == "") {
    ElMessage({
      message: "请先选择代码分类",
      grouping: true,
      type: "warning",
    });
  } else {
    dialogTitle.value = "修改代码分类";
    dialogFormVisible.value = true;
  }
}

function IsEmpty(res) {
  if (res.match(/^[ ]*$/)) {
    return true;
  } else {
    return false;
  }
}
//校验规则
const rules = ref ({
  dmflbm: [
    {
      required: true,
      message: "请填写代码分类编码",
      trigger: "blur",
    },
    {
      min: 1,
      max: 32,
      message: "代码分类编码长度为1-32个字符",
      trigger: "blur",
    },
  ],
  dmflmc:[
    {
      required: true,
      message: "请填写代码分类名称",
      trigger: "blur",
    },
    {
      min: 1,
      max: 64,
      message: "代码分类编码长度为1-64个字符",
      trigger: "blur",
    },
  ],
  ztdm:[
    {
      required: true,
      message: "请选择状态",
      trigger: "blur",
    },
  ],
  dmbm: [
    {
      required: true,
      message: "代码编码不能为空",
      trigger: "blur",
    },
    {
      min: 1,
      max: 32,
      message: "代码分类编码长度为1-32个字符",
      trigger: "blur",
    },
  ],
  dmmc: [
    {
      required: true,
      message: "代码名称不能为空",
      trigger: "blur",
    },
    {
      min: 1,
      max: 64,
      message: "代码分类编码长度为1-64个字符",
      trigger: "blur",
    },
  ],
});

//代码分类保存按钮
function onSubmitDmfl() {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdateDmfl(dmflForm).then((res) => {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: "success",
        });
        initDmflList();
        dialogFormVisible.value = false;
        yskz.value=false;
      });
    } else {
      return false;
    }
  })
}
//代码取消按钮
function resetFormDmfl() {
  dialogFormVisible.value = false;
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.ztdm = "";
  yskz.value=false;
}
//代码分类x按钮
function closeDmflDialogForm() {
  dialogFormVisible.value = false;
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.ztdm = "";
}

//代码保存按钮
function onSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdate(form).then((res) => {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: "success",
        });
        initDmList(currentDmflbm.value);
        open.value = false;
      });
      } else {
      return false;
    }
  })
}
//代码取消按钮
function resetForm() {
  open.value = false;
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.ztdm = "";
}
//代码x按钮
function closeDialogForm() {
  open.value = false;
  dmflForm.bh = "";
  dmflForm.dmflbm = "";
  dmflForm.dmflmc = "";
  dmflForm.ztdm = "";
}

// 更新代码明细状态
function updateDmztdm(dmmx) {
  updateZtdm(dmmx).then((res) => {
    if (res.code == 0) {
      ElMessage({
        message: res.msg,
        grouping: true,
        type: "success",
      });
    } else {
      ElMessage({
        message: res.msg,
        grouping: true,
        type: "error",
      });
    }
  });
}

// 添加下级代码明细
function insXjdm(row) {
  title.value = "添加下级代码";
  form.bh = "";
  form.dmbm = "";
  form.dmflbm = row.dmflbm;
  form.dmmc = "";
  form.sjbh = row.bh;
  form.xssxh = "";
  form.ztdm = "0";
  form.ztdmStr = "未知";
}

// 修改代码明细
function updataDmmx(dmmx) {
  title.value = "修改代码明细";
  form.bh = dmmx.bh;
  form.dmbm = dmmx.dmbm;
  form.dmflbm = dmmx.dmflbm;
  form.dmmc = dmmx.dmmc;
  form.sjbh = dmmx.sjbh;
  form.xssxh = dmmx.xssxh;
  form.ztdm = dmmx.ztdm;
  form.ztdmStr = dmmx.ztdmStr;
  yskz.value=false;
}

function deleteDm(bh) {
  ElMessageBox.confirm("确定是否删除", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteDmByBh(bh).then((res) => {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: "success",
        });
        initDmList(currentDmflbm.value);
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
}

// 树型选择器
const props = {
  value: "dmflbm",
  label: "dmflmc",
  children: "children",
};

// 操作成功或失败信息提示
function elmessage(responsResult, msg) {
  if (responsResult == true) {
    ElMessageBox.confirm(msg, {
      type: "success",
      // 不显示确认、取消按钮
      showConfirmButton: false,
      showCancelButton: false,
    });
    // 刷新表格
    gnxxlist(dmflbm.value).then((res) => {
      dmflmxlist.value = treeto(res.data);
    });
    // 初始化表单
    clearaForm();
  } else {
    //  更新状态失败
    ElMessageBox.confirm(msg, {
      type: "errror",
      showConfirmButton: false,
      showCancelButton: false,
    });
  }
  setTimeout(() => {
    ElMessageBox.close();
  }, 500);
}

// 初始化表单
function clearaForm() {
  title.value = "添加代码明细";
  form.bh = "";
  form.dmbm = "";
  form.dmflbm = currentDmflbm.value;
  form.dmmc = "";
  form.sjbh = "";
  form.xssxh ="1";
  form.ztdm = "0";
  form.ztdmStr = "未知";
}
</script>

<style lang="scss" scoped>
.seach-input {
  height: 30px;
}

.btn-seach {
  background-color: #366cb3;
  color: #ffffff;
  margin-left: 10px;
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: #fff3e0;
}
</style>
