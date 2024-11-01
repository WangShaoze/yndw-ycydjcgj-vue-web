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
            <el-button 
              icon="plus"
              round
              class="btn-seach"
              @click="dialogFormVisible = true,dialogTitle='添加操作人',addGw()"
              >
              添加
            </el-button>
          </div>
        </fieldset>
          <!--表格-->
            <el-table :data="tableData" border style="width: 100%; margin-top: 20px" id="vcfResult">
              <el-table-column type="index" align = "center" />
              <el-table-column label="岗位" >
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
              <el-table-column label="账号" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.dlzh }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="手机号">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.sjhm }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="办公室号码">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.bgdhhm }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" align = "center">
                <template #default="scope">
                  <el-button
                      type="success" plain>
                    {{ scope.row.czyztdmStr }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align = "center" width="260">
                <template #default="scope">
                    <el-button type="primary" plain @click="dialogFormVisible = true,dialogTitle='修改操作人',editApplication(scope.row)">
                      <span>修改</span>
                    </el-button>
                    <el-button type="danger" plain @click="deleteApplication(scope.row)">
                      <span>删除</span>
                    </el-button>
                    <el-button type="warning" plain @click="resetDlmmApplication(scope.row)">
                      <span>重置密码</span>
                    </el-button>
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
    </el-col>

    </el-row>

  <!--  添加页面-->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" @close="closeDialogForm">
    <el-form
        ref="formRef"
        :rules="rules"
        :model="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="right"
        status-icon
    >
        <el-row :gutter="24" style="height:65px">
          <el-col :span="8">
            <el-form-item label="岗位" prop="gwbh">
              <el-select v-model="ruleForm.gwbh" placeholder="请选择岗位">
                <el-option v-for="(item,index) in getGwList"  :label="item.gwmc" :value="item.bh" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账号" prop="dlzh" required>
              <el-input v-model="ruleForm.dlzh" placeholder="请输入账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="czymc" required>
              <el-input v-model="ruleForm.czymc" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="height:65px">
          <el-col :span="8">
            <el-form-item label="工号" prop="czygh" >
              <el-input v-model="ruleForm.czygh" placeholder="请输入工号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="办公室号码" prop="bgdhhm" >
              <el-input v-model="ruleForm.bgdhhm" placeholder="请输入办公室号码"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="sjhm" required>
              <el-input v-model="ruleForm.sjhm" placeholder="请输入手机号码"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="height:65px">
          <el-col :span="8">
            <el-form-item label="性别" prop="xbdm">
              <el-radio-group v-model="ruleForm.xbdm">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="csrq">
                  <el-date-picker
                      v-model="ruleForm.csrq"
                      type="date"
                      label="Pick a date"
                      style="width:100%;"
                      placeholder="请选择出生日期"
                  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职称" prop="zc" >
              <el-input v-model="ruleForm.zc" placeholder="请输入职称"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="height:65px">
          <el-col :span="8">
            <el-form-item label="职务" prop="zw" >
              <el-input v-model="ruleForm.zw" placeholder="请输入职务"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="dw" >
              <el-input v-model="ruleForm.dw" placeholder="请输入单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="4A邮箱" prop="email" >
              <el-input v-model="ruleForm.email" placeholder="请输入4A邮箱"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="height:65px">
          <el-col :span="24">
            <el-form-item label="状态" prop="czyztdm">
              <el-radio-group v-model="ruleForm.czyztdm">
                <el-radio label="1">正常</el-radio>
                <el-radio label="2">停用</el-radio>
                <el-radio label="3">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align: center">
          <el-form-item style="display: inline-block">
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="resetForm()">取消</el-button>
          </el-form-item>
        </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import * as XLSX from 'xlsx'
import {ElMessage, ElTree} from "element-plus/es";
import {list, getDataList, gwList,saveOrUpdate,deleteBh,resetDlmm} from '../api/czygl'
//添加
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessageBox} from "element-plus";


//tree数据
const dataTree = ref([])
//添加按钮弹窗
const dialogFormVisible = ref(false)
const dialogTitle = ref("")
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
//组织编号
const zzbh = ref("")
//初始化对象
const saveParam = ref({
  czybh: '',
  gnxxList: []
})

const formRef = ref(null);
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
  zzbh: "", // 搜索条件
  czymc: "",
  pagenum: 1,
  pagesize: 10,
});


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

//刷新
const Refresh = async () => {
  Treelist();
};

const total = ref(0);
// 刷新表格数据
function tableRefulsh(){
  getDataList(queryForm.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })

}
//点击渲染表格数据
const handleNodeClick =async (treeNode) => {
  if (treeNode) {
    queryForm.value.zzbh = treeNode.bh;
    param.value.zzbh = treeNode.bh
  }
  tableRefulsh()
  gw()
  
}
//查询条件
const param = ref({
  zzbh:""
})
function gw(){
  gwList(param.value).then(res => {
    getGwList.value = res.data
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
  getDataList(queryForm.value).then((res) => {
    tableData.value = res.data
    total.value = res.count;
  })
};


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive({
  bh:'',
  gwbh: '',
  gwmc: '',
  dlzh: '',
  czymc: '',
  czygh: '',
  bgdhhm: '',
  sjhm: '',
  xbdm: '',
  csrq: '',
  zc: '',
  zw: '',
  dw: '',
  email: '',
  czyztdm: '',
})


//获取岗位信息
const getGwList = ref([])


//添加按钮
function addGw(){
  gw()
}

const rules: FormRules = {
  gwbh: [
    { required: true, message: '请选择岗位', trigger: 'change' },
  ],
  gwmc:[
    { required: true, message: '请选择岗位', trigger: 'blur' },
  ],
  dlzh:[
    { required: true, message: '请输入账号', trigger: 'change' },
    { min:6, max:15,message: '账号在字符6--15位', trigger: 'change' },
  ],
  czymc:[
    { required: true, message: '请输入姓名', trigger: 'change' },
    { min:1, max:20, message: '姓名字段位1到15位字符', trigger: 'change' },
  ],
  czygh:[
    { max:64, message: '工号字段不允许超过64位', trigger: 'blur' }
  ],
  bgdhhm:[
    { max:20, message: '办公室号码字段不允许超过20位', trigger: 'blur' }
  ],
  sjhm:[
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { min:1,max:20, message: '请输入手机号码', trigger: 'change'},
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
  ],
  xbdm:[
    { required: true, message: '请选择性别', trigger: 'change' },
    { max:8, message: '性别代码最大长度不能超过8', trigger: 'change' }
  ],
  zc:[
    { max:50, message: '职称最大长度不能超过50', trigger: 'change' }
  ],
  zw:[
    { max:50, message: '职务最大长度不能超过50', trigger: 'change' }
  ],
  dw:[
    { max:50, message: '单位最大长度不能超过50', trigger: 'change' }
  ],
  email:[
    { required: true, message: '请输入4A邮箱', trigger: 'change' },
    { min:1, max:50,message: '请输入4A邮箱', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的4A邮箱', trigger: 'change' }
  ],
  czyztdm:[
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}
//保存按钮
function submitForm(){
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdate(ruleForm).then(res => {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: 'success',
        })
        queryForm.value.zzbh = param.value.zzbh
        tableRefulsh()
      }), setTimeout(() => {
        dialogFormVisible.value = false
      }, 2000)
    }
  })
}
//取消按钮
function resetForm(){
  dialogFormVisible.value = false
  Object.keys(ruleForm).map(key => {
    delete ruleForm[key]
  })
}
//x按钮
function closeDialogForm(){
  dialogFormVisible.value = false
  Object.keys(ruleForm).map(key => {
    delete ruleForm[key]
  })
}


//修改按钮
function editApplication(czyxx){
  param.value.zzbh=czyxx.zzbh
  gw()
  ruleForm.gwbh = czyxx.gwbh
  ruleForm.gwmc = czyxx.gwmc
  ruleForm.dlzh = czyxx.dlzh
  ruleForm.czymc = czyxx.czymc
  ruleForm.czygh = czyxx.czygh
  ruleForm.bgdhhm = czyxx.bgdhhm
  ruleForm.sjhm = czyxx.sjhm
  ruleForm.xbdm = czyxx.xbdm
  ruleForm.csrq = czyxx.csrq
  ruleForm.zc = czyxx.zc
  ruleForm.zw = czyxx.zw
  ruleForm.dw = czyxx.dw
  ruleForm.email = czyxx.email
  ruleForm.czyztdm = czyxx.czyztdm
  ruleForm.bh = czyxx.bh
}

//删除
function deleteApplication(czyxx){
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
        deleteBh(czyxx.bh).then(res => {
          ElMessage({
            message: res.msg,
            grouping: true,
            type: 'success',
          })
          queryForm.value.zzbh = param.value.zzbh
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

//重置密码
function resetDlmmApplication(czyxx){
  ElMessageBox.confirm(
      '确定是否重置密码',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        resetDlmm(czyxx.bh).then(res =>{
          ElMessage({
            message:res.msg,
            grouping: true,
            type: 'success',
          })
          queryForm.value.zzbh = param.value.zzbh
          tableRefulsh()
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消重置密码',
        })
      })
}


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

/*.el-input, .el-input--default {*/
/*  height: 50px;*/
/*}*/

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>