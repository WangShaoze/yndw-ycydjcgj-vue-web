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
                  v-model="queryForm.userNamePart"
                  input-style="width: 300px;"
                  placeholder="请输入名称"
                  style="margin-right:20px"
              />
              用户编号:
              <el-input
                  v-model="queryForm.userCodePart"
                  input-style="width: 300px;"
                  placeholder="请输入用户编号"
                  style="margin-right:20px"
              />
              <el-button
                  icon="Search"
                  class="btn-seach"
                  @click="searchUserByLike"
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
              @click="addClick"
              style="margin-top:40px"
          >
            添加
          </el-button>

          <el-table :data="userLis" border style="width: 100%; margin-top: 20px">
            <el-table-column type="index" label="序号" align="center" width="60"/>
            <el-table-column prop="ju" label="区局" align="center" width="290"/>
            <el-table-column prop="suo" label="供电所" align="center" width="120"/>
            <el-table-column prop="userCode" label="用户编号" align="center" width="180"/>
            <el-table-column prop="userName" label="用户名称" align="center" width="290"/>
            <el-table-column label="操作" align="center" width="260">
              <template #default="{ row }">
                <el-button
                    type="xg"
                    size="small"
                    plain
                    @click="open=true, updateUser(row)"
                >修改
                </el-button>
                <el-button type="danger" size="small" @click="removeUser(row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              v-model:currentPage="queryForm.page"
              v-model:page-size="queryForm.limit"
              :page-sizes="[5, 10, 15]"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="queryForm.count"
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
  <el-dialog v-model="open" :title="addDialogTile" draggable
             @close="handleclose"
  >
    <el-form ref="formRef" :model="jsform" :rules="rules">

      <el-form-item label="所属供电所"
                    :label-width="formLabelWidth"
                    prop="ssgds"
      >
        <el-tree-select
            v-model="jsform.zzbh"
            :data="dataTreeDialog"
            check-strictly="true"
            default-expand-all
            :props="defaultProps1"
            @node-click="handleNodeClick1"
        />
      </el-form-item>

      <el-form-item
          label="用户名称"
          :label-width="formLabelWidth"
          prop="yhmc"
      >
        <el-input v-model="jsform.user_name" autocomplete="off"/>
      </el-form-item>

      <el-form-item
          label="用户编号"
          :label-width="formLabelWidth"
          prop="yhbh"
      >
        <el-input v-model="jsform.user_id" autocomplete="off"/>
      </el-form-item>
    </el-form>

    <!-- 弹窗底部 -->
    <template #footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="handleclose">取消</el-button>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElMessage, ElTree} from "element-plus";
import {list} from "../../../sqgl/api/gwsq.js";
import {
  searchDataBySuo,
  searchDataByJu,
  searchDataByZhongJu,
  searchDataByLike,
  addNewUser,
  updateUserInfo,
  delUser
} from "@/api/yyckydlgl/table_data_show";
import type {FormRules} from "element-plus";

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

// 保存用户所在的节点
let currentNode = null;


//组织机构
const dataTree = ref([])
// 组织编号
const zzbh = ref()

//tree树型控件
const defaultProps = {
  children: 'children',
  label: 'zzmc',
}


const resPageData = ref({
  "data": [],
  "code": 0,
  "page": 1,
  "limit": 10,
  "count": 0,
});

const userLis = ref([]);


// 分页处理
const handleSizeChange = (pagesize) => {
  queryForm.value.page = 1;
  queryForm.value.limit = pagesize;
  flushTable(currentNode);
};
const handleCurrentChange = (pagenum) => {
  queryForm.value.page = pagenum;
  flushTable(currentNode);
};

// 点击修改按钮
const updateUser = (row) => {
  console.log(row)
  jsform.ID = row.id
  jsform.zzbh = row.suo
  jsform.user_id = row.userCode
  jsform.user_name = row.userName
  jsform.suo = row.suo
  jsform.suo_id = row.suoId
  jsform.sjbhs = row.sjbhs
  addDialogTile.value = "修改用户信息"
  dialogTreeNodeInfo.value.zzmc = row.suo
}
const removeUser = async (row) => {
  await delUser({id: row.id}).then((res) => {
    handleNodeClick(currentNode)
    ElMessage({
      message: res.msg,
      type: res.code === 0 ? "success" : "error",
    });
  })
}


// 刷新表格的时候用到
const flushTable = async (treeNode) => {
  console.log("treeNode:")
  console.log(treeNode)
  if (treeNode){
    if (treeNode.children.length > 0 && treeNode.zzmc.indexOf("文山") !== -1 && treeNode.zzmc.indexOf("供电局") !== -1) {
      if (treeNode.zzmc.indexOf("文山供电局") !== -1) {   // 文山供电局 所有数据
        resPageData.value = await searchDataByZhongJu({
          page: queryForm.value.page,
          limit: queryForm.value.limit,
          "zzbh": treeNode.bh, "zzmc": treeNode.zzmc, "sjbhs": treeNode.sjbhs
        })
      } else {     // 文山供电局分局 数据
        resPageData.value = await searchDataByJu({
          page: queryForm.value.page,
          limit: queryForm.value.limit,
          "zzbh": treeNode.bh, "zzmc": treeNode.zzmc, "ju_id": treeNode.bh, "ju": treeNode.zzmc, "sjbhs": treeNode.sjbhs
        })
      }
    } else {
      if (treeNode.zzmc.indexOf("供电所") !== -1) {
        // 各个供电所面的数据
        resPageData.value = await searchDataBySuo({
          page: queryForm.value.page,
          limit: queryForm.value.limit,
          "zzbh": treeNode.bh, "zzmc": treeNode.zzmc, "suo_id": treeNode.bh, "suo": treeNode.zzmc, "sjbhs": treeNode.sjbhs
        })
      }
    }
  }
  if (resPageData) {
    userLis.value = resPageData.value.data
    queryForm.value.page = resPageData.value.page
    queryForm.value.limit = resPageData.value.limit
    queryForm.value.count = resPageData.value.count
  }
}

const jsform = reactive({
  ID: "",
  zzbh: "",
  user_name: '',
  user_id: '',
  suo: '',
  suo_id: '',
  sjbhs: ''
})

//定义dialog表单树结构
const dataTreeDialog = ref([]);
const defaultProps1 = {
  value: "bh",
  label: "zzmc",
  children: "children",
};


// 清空表单
// 初始化表单
function clearForm() {
  jsform.user_name = ''
  jsform.user_id = ''
}

// 自定义表单lable标签宽度
const formLabelWidth = '100px'

// 添加弹出对话框标题
const addDialogTile = ref("添加用户")

// 是否打开弹窗
const open = ref(false)

// 点击添加按钮
const addClick = () => {
  addDialogTile.value = "添加用户"
  open.value = true;
  clearForm();
  list().then((res) => {
    dataTreeDialog.value = res.data;
  })

}

//From表单校验
const rules: FormRules = {
  user_name: [
    {max: 18, message: '长度不超过 18 个字符', trigger: 'blur'}
  ],
  user_id: [
    {max: 10, message: '长度不超过 10 个字符', trigger: 'blur'}
  ],
};

const formRef = ref(null);

// 点击保存按钮
const onSubmit = () => {
  formRef.value.validate((valid) => {
    // 判断zzxx是否是"供电所"
    if (dialogTreeNodeInfo.value.zzmc.indexOf("供电所") !== -1) {
    } else {
      ElMessage({
        message: "请选择供电所！",
        type: "warning",
      });
    }
    if (valid) {
      if (addDialogTile.value === "添加用户") {
        addNewUser({
          id: "",
          userCode: jsform.user_id,
          userName: jsform.user_name,
          suoId: jsform.zzbh,
          suo: dialogTreeNodeInfo.value.zzmc,
          sjbhs: dialogTreeNodeInfo.value.sjbhs
        }).then((res) => {
          if ((res.data.id !== undefined || res.data.id !== "") && (res.data.id.length > 0)) {
            handleclose();
            handleNodeClick(currentNode)
            console.log("刷新数据")
            ElMessage({
              message: "保存成功！",
              type: "success",
            });
          }
        });
      }
      if (addDialogTile.value === "修改用户信息") {
        updateUserInfo({
          id: jsform.ID,
          userCode: jsform.user_id,
          userName: jsform.user_name,
          suoId: jsform.zzbh,
          suo: dialogTreeNodeInfo.value.zzmc,
          sjbhs: jsform.sjbhs
        }).then((res) => {
          if ((res.data.id !== undefined || res.data.id !== "") && (res.data.id.length > 0)) {
            handleclose();
            handleNodeClick(currentNode)
            console.log("刷新数据")
            ElMessage({
              message: "修改成功！",
              type: "success",
            });
          }
        })
      }

    } else {
      ElMessage({
        message: "数据校验失败！",
        type: "error",
      });
    }
  });
}

// 点击取消按钮
const handleclose = () => {
  open.value = false
}

// 保存对话框中那棵树点击时的信息
const dialogTreeNodeInfo = ref({
  zzmc: "",
  bh: "",
  sjbhs: ""
});


// dialog 中选择 供电所的时候需要更新
const handleNodeClick1 = (treeNode) => {
  dialogTreeNodeInfo.value = {
    zzmc: treeNode.zzmc,
    bh: treeNode.bh,
    sjbhs: treeNode.sjbhs,
  }
  currentNode = treeNode
}


//点击渲染表格数据
const handleNodeClick = (treeNode) => {
  // 刷新表格数据
  if (treeNode) {
    flushTable(treeNode)
    currentNode = treeNode
  }
}


//渲染树形结构
function initTree() {
  list().then((res) => {
    zzbh.value = res.data[0].bh
    dataTree.value = res.data
  })
}

initTree()

//刷新
const Refresh = async () => {
  initTree();
};
// 分页以及搜索条件
const queryForm = ref({
  page:1,
  limit:10,
  count:0,
  userNamePart: "",   // 搜索条件
  userCodePart: "",
});

// 重置按钮，自动查询，该供电局和供电所下的数据
const resetClick = async () => {
  queryForm.value.userNamePart = ""
  queryForm.value.userCodePart = ""
  handleNodeClick(currentNode)
};


// 模糊查询用户
const searchUserByLike = async () => {
  resPageData.value = await searchDataByLike({
    page: queryForm.value.page,
    limit: queryForm.value.limit,
    user_name_part: queryForm.value.userNamePart,
    user_code_part: queryForm.value.userCodePart
  });
  await flushTable(null)
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