<template>
  <el-dialog :title="dialogTitle" width="40%" @close="handleClose" draggable :model-value="dialogVisible">
    <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
      <el-form-item label="上级编号">
        <el-tree-select v-model="form.sjbh" :data="TreeData" check-strictly default-expand-all :props="Treeprops" />
      </el-form-item>
      <el-form-item label="名称" prop="zzmc">
        <el-input v-model="form.zzmc" />
      </el-form-item>
      <el-form-item label="简称" prop="zzjc">
        <el-input v-model="form.zzjc" />
      </el-form-item>
      <el-form-item label="地址" prop="zzdz">
        <el-input v-model="form.zzdz" />
      </el-form-item>
      <el-form-item label="组织类型" prop="dwbz">
        <el-radio-group v-model="form.dwbz" class="ml-4">
          <el-radio label="1" size="small">单位</el-radio>
          <el-radio label="2" size="small">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="办公电话号码" prop="bgdhhm">
        <el-input v-model="form.bgdhhm" />
      </el-form-item>
      <el-form-item label="传真号码" prop="czhm">
        <el-input v-model="form.czhm" />
      </el-form-item>
      <el-form-item label="显示顺序号" prop="xssxh">
        <el-input v-model="form.xssxh" />
      </el-form-item>
      <el-form-item label="状态" prop="zzztdm">
        <el-radio-group v-model="form.zzztdm" class="ml-4">
          <el-radio label="1" size="small">正常</el-radio>
          <el-radio label="0" size="small">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import { addZzxxApi, getZzglList } from "@/api/zhgl/zzgl";
import { isNull, beTree } from "./filters";
import { ElMessage } from "element-plus";
const formRef = ref(null);
const form = ref({
  zzmc: "",
  zzjc: "",
  zzdz: "",
  dwbz: "",
  bgdhhm: "",
  czhm: "",
  xssxh: "",
  zzztdm: "",
  sjbh: "",
  bh: "",
});

const TreeData = ref([]);

//表单校验规则
const rules = ref({
  zzmc: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 0, max: 200, message: "长度在 0 到 200 个字符", trigger: "blur" },
  ],
  zzjc: [
    { required: true, message: "请输入简称", trigger: "blur" },
    { min: 0, max: 200, message: "长度在 0 到 200 个字符", trigger: "blur" },
  ],
  zzdz: [
    { required: true, message: "请输入地址", trigger: "blur" },
    { min: 0, max: 200, message: "长度在 0 到 200 个字符", trigger: "blur" },
  ],
  dwbz: [
    {
      required: true,
      message: "请选择组织类型",
      trigger: "change",
    },
    { min: 0, max: 60, message: "长度在 0 到 60 个字符", trigger: "blur" },
  ],
  bgdhhm: [
    { required: true, message: "请输入办公室电话号码", trigger: "blur" },
    { min: 0, max: 20, message: "长度在 0 到 20 个字符", trigger: "blur" },
  ],
  czhm: [
    { required: true, message: "请输入传真号码", trigger: "blur" },
    { min: 0, max: 12, message: "长度在 0 到 20 个字符", trigger: "blur" },
  ],
  zzztdm: [
    {
      required: true,
      message: "请选择状态",
      trigger: "change",
    },
  ],
});
// 父传子==》传递属性
const props = defineProps({
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogTableValue: {
    type: Object,
    default: () => { },
  },
});

const initTree = async () => {
  const res = await getZzglList();
  TreeData.value = res.data;
  // TreeData.value = beTree(res.data);
};
// 监视属性，一旦发生改变，就执行操作
initTree();
watch(
  () => props.dialogTableValue,
  () => {
    form.value = props.dialogTableValue;
  },
  { deep: true, immediate: true }
);
const emits = defineEmits(["update:modelValue"]);
// 退出键和取消键用的是同一个回调==> 是的 ，用的close回调,   emits("update:modelValue", false); 改的是父组件的dialogVisible 的值，改为false，自然关闭了，开始调用api了
const handleClose = () => {
  emits("update:modelValue", false);
};
const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      addZzxxApi(form.value).then((res) => {
        handleClose();
        emits("initZzgl");
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
// 树形选择器,树结构节点包含的东西
const Treeprops = {
  value: "bh",
  label: "zzmc",
  children: "children",
};
</script>

<style>
</style>