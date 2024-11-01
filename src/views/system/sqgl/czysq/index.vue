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
      <!--搜索-->
      <div style="margin-left: 30px; margin-top: 20px; margin-right:30px">
      <fieldset style="border: 1px solid #dcdfe6; padding: 30px">
          <legend>搜索信息</legend>
          <div class="div1">
            名称:
              <el-input 
                v-model="queryForm.czymc"
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
        <el-table :data="tableData" border style="width: 100%;margin-top: 20px" id="vcfResult">
          <el-table-column label="岗位" width="230">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.gwmc }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.czymc }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="账号">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.dlzh }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态"  align="center">
            <template #default="scope">
              <el-button
                  type="success" plain>
                {{ scope.row.czyztdmStr }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作"  align="center">
            <template #default="scope">
                <el-button type="warning" plain @click="dialogFPGNFormVisible = true,getFPGNLDateList(scope.row.bh)">
                  <el-icon>
                    <Edit/>
                  </el-icon>&nbsp;
                  <span>分配功能</span>
                </el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination
              v-model:currentPage="currentPage4"
              v-model:page-size="pageSize4"
              :page-sizes="[10, 20, 30, 40]"
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
      
      </el-card>
    </el-col>
  </el-row>

  <!--  分配功能-->
  <el-dialog v-model="dialogFPGNFormVisible" title="操作员功能分配">
    <el-tree
        ref="treeRef"
        :data="FPGLData"
        show-checkbox
        :props="defaultFPGLProps"
        :default-checked-keys="checkDefault"
        node-key="id"
        default-expand-all
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="jsSubmit">保存</el-button>
        <el-button type="primary" @click="dialogFPGNFormVisible = false"
        >取消</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import * as XLSX from 'xlsx'
import {list,getDataList, getCzyGnList,setGnxxToCzy,} from "../api/czysq.js"
import {ElMessageBox,ElMessage, ElTree} from "element-plus/es";
import { tr } from "element-plus/lib/locale";


//tree数据
const dataTree = ref([])
//表格数据
const tableData = ref([])
//操作员列表
const czylist = ref([])
//操作员编号
const czybh = ref()
// 功能树选中
const checkDefault = ref([])
//操作员分配功能树
const FPGLData = ref([])
//初始化对象
const saveParam =ref( {
  czybh:'',
  gnxxList:[]
})
// 响应结果
const responsResult = ref(false)

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)


//tree树型控件
const defaultProps = {
  children: 'children',
  label: 'zzmc',
}

// 分页以及搜索条件
const queryForm = ref({
  zzbh: "", // 搜索条件
  czymc: "",
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

//刷新
const Refresh = async () => {
  Treelist();
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


//将数组数据转换为树形数据
function listToTree(list) {
  let myTree = list.filter((father) => {
    let branchArr = list.filter(child => child.sjbh == father.bh)  //返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
    return father.sjbh == 0;  //返回第一层
  })
  return myTree
}


//查询条件
const param = ref({
  zzbh:""
})

//渲染树形结构
function Treelist() {
  list().then((res) => {
    czylist.value = res.data
    dataTree.value = res.data
    queryForm.value.zzbh = res.data[0].bh
    param.value.zzbh = res.data[0].bh
    tableRefulsh();
  })
}

Treelist()

// 刷新表格数据
function tableRefulsh(){
  getDataList(queryForm.value).then((res) => {
    tableData.value = res.data
  })

}
//点击渲染表格数据
const handleNodeClick = (treeNode) => {
  // 刷新表格数据
 if (treeNode) {
    queryForm.value.zzbh = treeNode.bh;
    param.value.zzbh = treeNode.bh
  }
  tableRefulsh()
}

//定义角色分配
const defaultFPGLProps = {
  label: 'title',
  children: 'children',
}

const dialogFPGNFormVisible = ref(false)

//获取操作员角色功能
const getFPGNLDateList = (bh) => {
  getCzyGnList(bh).then((res) => {
    //初始化默认选中
    checkDefault.value.length = 0
    FPGLData.value = res.data
    res.data.forEach(item => {
        // checkDefault.value = checkDefault.value.concat(recoverSetCheck(item,checkDefault.value))
        
    checkDefault.value = checkDefault.value.concat((recoverSetCheck(item,[])))
    })
  })
  czybh.value = bh
}

function recoverSetCheck(tree, checkArr){
  if(tree.children.length > 0){
    tree.children.forEach(item => {
        checkArr = recoverSetCheck(item,checkArr)
    })
  }
  if(tree.checked){
    checkArr.push(tree.id)
  }
  return checkArr
}

//分配功能
const treeRef = ref<InstanceType<typeof ElTree>>()



const jsSubmit = () => {
// 获取树选中数组

  const gnxxlist = treeRef.value!.getCheckedNodes().concat(treeRef.value!.getHalfCheckedNodes())
  setGnxxToCzy(czybh.value,gnxxlist).then((res) => {

    if (res.msg == '操作员分配角色功能之外的功能成功'){
      responsResult.value = true
      dialogFPGNFormVisible.value = false
    }
    else{
      responsResult.value = false
    }
    elmessage(responsResult.value, res.msg)
  })
}

//导出
const exportExcelDemo = ()=>{
  let workbook = XLSX.utils.table_to_book(document.getElementById('vcfResult'));
  try {
    XLSX.writeFile(workbook,"操作员信息表.xlsx")
    ElMessage({
      type: 'success',
      message: '导出成功!'
    })
  }catch (e) {
    ElMessage.error('导出失败,失败信息:!')
  }
}

// 分页处理
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
  getDataList(queryForm.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })
};

//添加
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const formLabelWidth = '140px'

</script>

<style scoped>

</style>

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