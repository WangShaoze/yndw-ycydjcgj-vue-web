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
  
      <!--搜索-->
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
                  clearable
                />
              <el-button
                icon="Search"
                round
                class="btn-seach"
                style="margin-left:20px"
                @click="handleNodeClick"
              >
              搜索
              </el-button>
            </div>
        
        </fieldset>
      <!--表格-->
        <el-table :data="tableData" border style="width: 100%; margin-top: 20px" >
          <el-table-column label="岗位名称" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.gwmc }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="岗位用途" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.gwytdm }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="岗位描述" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.gwms }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="scope">
              <el-button
                  type="success" plain
                  v-if="scope.row.gwztdm == '1' ? gwztdmStr='正常':gwztdmStr='异常'">
                {{ gwztdmStr }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
                <el-button type="warning" plain @click="dialogGWGLFormVisible = true,getGWFPDateList(scope.row.bh)">
                  <el-icon>
                    <Edit/>
                  </el-icon>&nbsp;
                  <span>角色分配</span>
                </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="demo-pagination-block">
          <el-pagination
              v-model:currentPage="queryForm.pagenum"
                v-model:page-size="queryForm.pagesize"
              :page-sizes="[10, 20, 30, 50]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              style="float: right"
          />
        </div>
        
      </div>
      </el-card>
    </el-col>

    </el-row>

  <!-- 分配角色弹窗 -->
  <el-dialog
      v-model="dialogGWGLFormVisible"
      title="岗位角色分配">
    <el-tree
        ref="treeRef"
        default-expand-all
        :data="GWGLData"
        show-checkbox
        :default-checked-keys="checkDefault"
        node-key="id"
        :props="defaultGWGLProps"
    />
    <template #footer>
      <el-button type="primary" @click="jsSubmit">保存</el-button>
      <el-button @click="dialogGWGLFormVisible = false">取消</el-button>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {ref} from "vue-demi"
import {ElMessage,ElMessageBox, ElTree} from 'element-plus'
import {list, getDataList, getGwjsList, setGnxxToJsxx} from "../api/gwsq.js";
import {getGwglListPage} from "@/api/zhgl/gwgl";

//组织机构
const dataTree = ref([])
// 组织编号
const zzbh = ref()
//表单数据
const tableData = ref([])
//分配功能
const GWGLData = ref([])
// 角色编号
const gwbh = ref()
// 功能树选中
const checkDefault = ref([])
// 响应结果
const responsResult = ref(false)


//tree树型控件
const defaultProps = {
  children: 'children',
  label: 'zzmc',
}

const queryForm = ref({
  zzbh: "", // 搜索条件
  gwmc: "",
  pagenum: 1,
  pagesize: 10,
});


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

const initGwxx = async () => {
  const res = await getGwglListPage(queryForm.value);
  tableData.value = res.data;
};

// 操作成功或者失败信息提示
function elmessage(responsResult, msg) {
  if (responsResult == true) {
    ElMessageBox.confirm(
        msg,
        {
          type: 'success',
          showConfirmButton: false,
          showCancelButton: false,
        }
    )
    // 刷新表格
    initGwxx()
  } else {
    //  更新状态失败
    ElMessageBox.confirm(
        msg,
        {
          type: 'error',
          showConfirmButton: false,
          showCancelButton: false,
        }
    )
  }
  setTimeout(() => {
    ElMessageBox.close()
  }, 2000)
}
//刷新
const Refresh = async () => {
  initTree();
};

//将数组数据转换为树形数据
function listToTree(list) {
  let myTree = list.filter((father) => {
    let branchArr = list.filter(child => child.sjbh == father.bh)  //返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
    return father.sjbh == 0;  //返回第一层
  })
  return myTree
}

//渲染树形结构
function initTree () {
  list().then((res) => {
    zzbh.value = res.data[0].bh
    dataTree.value = res.data
    queryForm.value.zzbh = res.data[0].bh
    initGwxx();
  })
}
initTree()


//点击渲染表格数据
const handleNodeClick = (treeNode) => {
  // 刷新表格数据
  
  if (treeNode) {
    queryForm.value.zzbh = treeNode.bh;
  }
  initGwxx()
  }

//定义角色分配
const defaultGWGLProps = {
  // value: 'bh',
  label: 'title',
  children: 'children',
}
const dialogGWGLFormVisible = ref(false)

//获取角色功能
const getGWFPDateList = (bh) => {
  getGwjsList(bh).then((res) => {
    //初始化默认选中
    checkDefault.value.length = 0
    GWGLData.value = res.data
    var arr = getOneArr(res.data)
    arr.forEach(item => {
      if (item.checked)
        checkDefault.value.push(item.id)
    })
  })
  gwbh.value = bh
}

// 树形数据转为一维数组
function getOneArr(arr) {
  let data = JSON.parse(JSON.stringify(arr))
  let newData = []
  const callback = (item) => {
    (item.children || (item.children = [])).map(v => {
      callback(v)
    })
    delete item.children
    newData.push(item)
  }
  data.map(v => callback(v))
  return newData
}

//分配功能
const treeRef = ref<InstanceType<typeof ElTree>>()

const jsSubmit = () => {
// 获取树选中数组
  const jsbhlist = treeRef.value!.getCheckedKeys(false)
  setGnxxToJsxx(gwbh.value,jsbhlist.toString()).then((res) => {
    if (res.code == 0){
      responsResult.value = true
      dialogGWGLFormVisible.value = false
    } else {
      responsResult.value = false
    }
    elmessage(responsResult.value, res.msg)
  })
}


//分页
const currentPage4 = ref(1)
const pageSize4 = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

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


</script>

<style scoped>

.seach-input {
  height: 30px;
  margin-left: 20px;
}
.btn-seach {
  background-color: #366cb3;
  color: #ffffff;
}
.left-dhl /deep/ .el-button {
  padding: 5px 8px;
}


.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>