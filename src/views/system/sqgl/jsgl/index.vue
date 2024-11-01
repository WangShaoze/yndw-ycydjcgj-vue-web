<template>
    
  <el-row>
    <el-col :span="6">
      <el-card class="box-card" :style="treeCardStyle" >
    <!-- 左侧应用列表 -->
      <div >
        <el-table :data="yylist" border row-key="bh" style="width: 100%; " @row-click="rowclick1"
                  highlight-current-row>
          <el-table-column label="应用名称" prop="yymc">
            <template #default="scope">
              {{ scope.row.yymc }}
              <el-icon style="float: right;">
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
      <el-card class="box-card" :style="tableCardStyle" >
    <div>
      <fieldset style="border: 1px solid #DCDFE6; padding: 20px;">
        <legend>操作信息</legend>
        <div class="div1">
          <el-button icon="plus" round class="btn-seach" @click="open=true, clearaForm()">
            添加
          </el-button>
        </div>
      </fieldset>
      <el-table :data="yyjsxx"
                stripe
                :v-loading="formLoading"
                style="width: 100%; padding-top: 20px"
                border
                row-key="bh"
                default-expand-all
                :tree-props="{ children: 'children' }"
                lazy>
        <el-table-column :width="item.width"
                         :prop="item.prop"
                         :label="item.label"
                         v-for="(item, index) in options"
                         :key="index">
          <template #default="{ row }" v-if="item.prop === 'jsbz'">
            <el-button :type="row.jsbz == 1 ? 'danger' : 'primary'"
                       size="small" plain>
              {{ row.jsbzStr }}
            </el-button>
          </template>
          <template #default="{ row }" v-else-if="item.prop === 'jsztdm'">
            <el-switch
                v-model="row.jsztdm"
                @change="gxZtdm(row)"
                active-value="1"
                inactive-value="0"
                active-text="正常"
                inactive-text="禁用"
                inline-prompt
                size="large"
            />
          </template>
          <template #default="{ row }" v-else-if="item.prop === 'action'">
            <el-button type="primary" size="small" @click="open = true, insXjjs(row.bh)">添加下级</el-button>
            <el-button type="info" size="small" plain @click="open = true, updata(row)">修改</el-button>
            <el-button type="danger" size="small" @click="delJs(row.bh)">删除</el-button>
            <el-button type="warning" size="small" @click=" getGnList(row.bh),fpgnDialog = true ">分配功能</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
      </el-card>
    </el-col>
  </el-row>

  <!-- 添加修改弹窗 -->
  <el-dialog v-model="open" :title="title" draggable>
    <el-form ref="formRef" :model="jsform" :rules="rules">
      <el-form-item label="上级角色" :label-width="formLabelWidth">
        <el-tree-select
            v-model="jsform.sjbh"
            :data="yyjsxx"
            :props="props"
            default-expand-all
            check-strictly
        />
      </el-form-item>
      <el-form-item label="角色标志" :label-width="formLabelWidth" prop="jsbz"
        :prop="jsform.jsbz">
        <el-radio-group v-model="jsform.jsbz" class="ml-4">
          <el-radio label="2" size="large">是</el-radio>
          <el-radio label="1" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="名称"
        :label-width="formLabelWidth"
        prop="jsmc"
        :prop="jsform.jsmc"

      >
        <el-input v-model="jsform.jsmc" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="jsform.jsms" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" placeholder=""/>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="jsztdm"
        :prop="jsform.jsztdm">
        <el-radio-group v-model="jsform.jsztdm" class="ml-4">
          <el-radio label="1" size="large">正常</el-radio>
          <el-radio label="0" size="large">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 弹窗底部 -->
    <template #footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="open = false">取消</el-button>
    </template>

  </el-dialog>

  <!-- 分配功能弹窗 -->
  <el-dialog
      v-model="fpgnDialog"
      title="角色功能分配"
      width="30%"
      destroy-on-close
      center
  >
    <el-tree
        ref="treeRef"
        default-expand-all
        :data="fpgn"
        show-checkbox
        :default-checked-keys="checkDefault"
        node-key="bh"
        :props="jsProps"
    />
    <template #footer>
      <el-button type="primary" @click="jsSubmit">保存</el-button>
      <el-button @click="fpgnDialog = false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {reactive, ref} from "vue"
import {ElMessage, ElMessageBox, ElTree, FormRules} from 'element-plus'
import {options} from "./options";
import {list, jsxxlist, updateZtdm, saveOrUpdate, deleteJs, getJsGnList, setGnxxToJsxx} from '../api/jsgl'
// 应用列表
const yylist = ref([])
// 搜索框应用名称
const yygnmc = ref()
// 角色类型代码
const jslx = ref()
// 应用对应角色
const yyjsxx = ref([])
// 应用功能名称
const yyjsmc = ref()
// 状态 booleant
const state = ref()
// 应用编号
const yybh = ref()
// 功能信息表单
const formLoading = ref(true)
const jsform = reactive({
  bh: '',
  sjbh: '',
  sjbhs:'',
  jsbz: '1',
  jsmc: '',
  jsms: '',
  jsztdm: '1',
  ssyybh: yybh
})
// 弹窗标题
const title = ref()
// 响应结果
const responsResult = ref(false)
// 分配功能弹窗
const fpgnDialog = ref(false)
// 分配功能
const fpgn = ref([])
// 校验
const formRef = ref(null);
// 角色编号
const jsbh = ref()
// 功能树选中
const checkDefault = ref([])

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

list().then((res) => {
  yylist.value = res.data
  yybh.value = res.data[0].bh
  jsxxlist(yybh.value).then((res) => {
    yyjsxx.value = treeto(res.data)
  });
});

function rowclick1(row, event, column) {
  // 更新应用编号
  yybh.value = row.bh
  jsxxlist(row.bh).then((res) => {
    yyjsxx.value = treeto(res.data)
  });
}


// 将数组数据转换为树型数据
function treeto(list) {
  let data = list.filter(father => {
    let branchArr = list.filter(child => child.sjbh == father.bh)  //返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
    return father.sjbh == 0;   //返回第一层
  });
  formLoading.value = false
  return data.reverse()

}

const open = ref(false)
// 自定义表单lable标签宽度
const formLabelWidth = '100px'

// 更新角色状态
function gxZtdm(jsxx) {
  updateZtdm(jsxx).then((res) => {
    if (res.msg == '更新角色状态成功')
      responsResult.value = true
    else
      responsResult.value = false
    elmessage(responsResult.value, res.msg)
  });
}

// 添加下级功能
function insXjjs(bh) {
  title.value = '添加下级角色'
  jsform.bh = ''
  jsform.sjbh = bh
  jsform.sjbhs = ''
  jsform.jsbz = '1'
  jsform.jsmc = ''
  jsform.jsms = ''
  jsform.jsztdm = '1'
  jsform.ssyybh = yybh
}

// 修改功能信息
function updata(jsxx) {
  title.value = '修改角色信息'
  jsform.bh = jsxx.bh
  jsform.sjbh = jsxx.sjbh
  jsform.sjbhs = jsxx.sjbhs
  jsform.jsbz = jsxx.jsbz
  jsform.jsmc = jsxx.jsmc
  jsform.jsms = jsxx.jsms
  jsform.jsztdm = jsxx.jsztdm
}

const rules: FormRules = {
  jsbz:[
    { required: true, message: '请选择角色标志', trigger: 'change' },
    {max: 8, message: '角色标志最大长度不能超过8', trigger: 'change'}
  ],
  jsmc:[
    { required: true, message: '请输入名称', trigger: 'change' },
    {max: 20, message: '名称最大长度不能超过20', trigger: 'change'}
  ],
  jsms:[
    { max:200, message: '描述最大长度不能超过200个字符', trigger: 'change' }
  ],
  jsztdm:[
    { required: true, message: '请选择状态', trigger: 'change' },
    {max: 8, message: '状态最大长度不能超过8', trigger: 'change'}
  ],
}
// 表单提交
const  onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdate(jsform).then((res) => {
        responsResult.value = true
        open.value = false
        elmessage(responsResult.value, res.msg)
      });
    } else {
      return false;
    }
  });
}

// 删除功能
function delJs(bh) {
  ElMessageBox.confirm(
      '确认删除此角色吗?',
      '提醒',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }
  )
      .then(() => {
        deleteJs(bh).then((res) => {
          if (res.msg == '删除角色成功')
            responsResult.value = true
          else
            responsResult.value = false
          elmessage(responsResult.value, res.msg)
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '您已取消删除',
        })
      })
}

// 树型选择器
const props = {
  value: 'bh',
  label: 'jsmc',
  children: 'children',
}

// 操作成功或失败信息提示
function elmessage(responsResult, msg) {
  if (responsResult == true) {
    ElMessageBox.confirm(
        msg,'操作',
        {
          type: 'success',
          // 不显示确认、取消按钮
          showConfirmButton: false,
          showCancelButton: false,
        }
    )
    // 刷新表格
    jsxxlist(yybh.value).then((res) => {
      yyjsxx.value = treeto(res.data)
    });
    // 初始化表单
    clearaForm()
  } else {
    //  更新状态失败
    ElMessageBox.confirm(
        msg,"更新",
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

// 初始化表单
function clearaForm() {
  title.value = '添加角色'
  jsform.bh = ''
  jsform.sjbh = ''
  jsform.jsbz = '1'
  jsform.jsmc = ''
  jsform.jsms = ''
  jsform.jsztdm = '1'
  jsform.ssyybh = yybh
}

// 获取角色功能
const jsProps = {
  children: 'children',
  label: 'mc',
}
// 获取功能
const getGnList = (bh) => {
  getJsGnList(yybh.value, bh).then((res) => {
    // 初始化默认选中
    checkDefault.value.length = 0
    fpgn.value = treeto(res.data)
    res.data.forEach(item => {
      if (item.checked && item.children == undefined)
        checkDefault.value.push(item.bh)
    })
  })
  jsbh.value = bh
}

const treeRef = ref<InstanceType<typeof ElTree>>()

const jsSubmit = () => {
// 获取树选中数组
  const gnbhlist = treeRef.value!.getCheckedKeys().concat(treeRef.value!.getHalfCheckedKeys())
  setGnxxToJsxx(jsbh.value, gnbhlist.toString()).then((res) => {
    if (res.msg == '角色分配功能成功'){
      responsResult.value = true
      fpgnDialog.value = false 
    }
    else
      responsResult.value = false
    elmessage(responsResult.value, res.msg)
  })
}
</script>
<style lang="scss" scoped>

.seach-input {
  height: 30px;

}

.btn-seach {
  background-color: #366CB3;
  color: #FFFFFF;
  margin-left: 10px;
}

:deep(.el-table__body tr.current-row>td.el-table__cell) {
  background-color: #FFF3E0;
}
</style>
