<template>
  <el-row>
    <el-col :span="5">
      <el-card class="box-card" :style="treeCardStyle">
        <el-button icon="Refresh" class="btn-refresh" @click="Refresh">
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
      <el-card class="box-card" :style="tableCardStyle">
        <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
          <fieldset style="border: 1px solid #dcdfe6; padding: 30px">
            <legend>搜索信息</legend>
            <div class="div1">
              用户名称:
              <el-input
                  v-model="queryForm.user_name"
                  input-style="width: 300px;"
                  placeholder="请输入名称"
                  style="margin-right:20px"
              />
              用户编号:
              <el-input
                  v-model="queryForm.user_id"
                  input-style="width: 300px;"
                  placeholder="请输入用户编号"
                  style="margin-right:20px"
              />
              <el-button
                  icon="Search"
                  class="btn-seach"
                  @click="handleNodeClick"
                  style="margin-left:20px"
              >
                查询
              </el-button>
              <el-button
                  icon="Refresh"
                  class="btn-reset"
                  @click="resetClick"
              >
                重置
              </el-button>
            </div>
          </fieldset>

          <el-button
              class="btn-add"
              @click="open=true, clearForm"
              style="margin-top:40px"

          >
            添加
          </el-button>

          <el-table :data="gwxx" border style="width: 100%; margin-top: 20px">
            <el-table-column type="index" label="序号" align="center" width="100"/>
            <el-table-column prop="ju" label="区局" align="center" width="300"/>
            <el-table-column prop="gds" label="供电所" align="center" width="240"/>
            <el-table-column prop="user_id" label="用户编号" align="center" width="300"/>
            <el-table-column prop="user_name" label="用户名称" align="center" width="180"/>
            <el-table-column label="操作" align="center" width="260">
              <template #default="{ row }">
                <el-button
                    type="xg"
                    size="small"
                    plain
                    @click="open=true, updataGwxx(row)"
                >修改
                </el-button
                >
                <el-button type="danger" size="small" @click="remove(row.bh)"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              v-model:currentPage="queryForm.pagenum"
              v-model:page-size="queryForm.pagesize"
              :page-sizes="[10, 20, 30, 50]"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              size="large"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              style="float: right;"

          />
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 添加修改弹窗 -->
  <el-dialog v-model="open" :title="addDialogTile" draggable>
    <el-form ref="formRef" :model="jsform" :rules="rules">
      <el-form-item
          label="用户名称"
          :label-width="formLabelWidth"
          prop="jsmc"
          :prop="jsform.user_name"

      >
        <el-input v-model="jsform.user_name" autocomplete="off"/>
      </el-form-item>

      <el-form-item
          label="用户编号"
          :label-width="formLabelWidth"
          prop="jsmc"
          :prop="jsform.user_id"
      >
        <el-input v-model="jsform.user_id" autocomplete="off"/>
      </el-form-item>
    </el-form>

    <!-- 弹窗底部 -->
    <template #footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="open = false">取消</el-button>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElTree} from "element-plus";
import {list} from "../../../sqgl/api/gwsq.js";

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
  'margin-rignt': '10px',
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

//组织机构
const dataTree = ref([])
// 组织编号
const zzbh = ref()


// const queryForm = ref({
//   zzbh: "", // 搜索条件
//   gwmc: "",
//   pagenum: 1,
//   pagesize: 10,
// });

//tree树型控件
const defaultProps = {
  children: 'children',
  label: 'zzmc',
}


// const initGwxx = async () => {
//   const res = await getGwglListPage(queryForm.value);
//   tableData.value = res.data;
// };


//点击渲染表格数据
const handleNodeClick = (treeNode) => {
  // 刷新表格数据

  if (treeNode) {
    queryForm.value.zzbh = treeNode.bh;
  }
  // initGwxx()
}


//渲染树形结构
function initTree() {
  list().then((res) => {
    zzbh.value = res.data[0].bh
    dataTree.value = res.data
    queryForm.value.zzbh = res.data[0].bh
    // initGwxx();
  })
}

initTree()

//刷新
const Refresh = async () => {
  initTree();
};


// 是否打开弹窗
const open = ref(false)

// 自定义表单lable标签宽度
const formLabelWidth = '100px'

// 添加弹出对话框标题
const addDialogTile = ref("添加用户")

const jsform = reactive({
  user_name: '',
  user_id: '',
  ju: '',
  gds: ''
})


// 分页以及搜索条件
const queryForm = ref({
  zzbh: "",
  suo: "",
  ju: "",
  user_name: "",   // 搜索条件
  user_id: "",
  pagenum: 1,
  pagesize: 10,
});

// 重置按钮，自动查询，该供电局和供电所下的数据
const resetClick = async () => {
  queryForm.value.user_name = "";
  queryForm.value.user_id = ""
};


// 清空表单
// 初始化表单
function clearForm() {
  jsform.user_name = ''
  jsform.user_id = ''
  jsform.ju = '丘北供电局'
  jsform.gds = '马关供电所'
}

const formRef = ref(null);

// 表单提交
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // saveOrUpdate(jsform).then((res) => {
      //   responsResult.value = true
      //   open.value = false
      // elmessage(responsResult.value, res.msg)
      // });
    } else {
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.btn-refresh {
  background-color: #366cb3;
  color: #ffffff;
}

.seach-input {
  height: 30px;
  margin-left: 20px;
}

.btn-seach {
  background-color: #1e9cf1;
  color: #ffffff;
  width: 120px;
  height: 45px;
  font-size: 20px;
}

.btn-reset {
  background-color: #ffffff;
  color: #333030;
  width: 120px;
  height: 45px;
  font-size: 20px;
}

.btn-add {
  background-color: #1e9cf1;
  color: #ffffff;
  width: 120px;
  height: 45px;
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