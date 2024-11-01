<template>
  <el-row>
    <el-col :span="6">
      <el-card class="box-card" :style="treeCardStyle" >
      
      <div style="height: 700px;">
        <el-table :data="yylist" border row-key="bh" style="width: 100%;" @row-click="rowclick1"
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
          <el-button
              icon="plus"
              round class="btn-seach"
              @click="open = true,
            clearaForm()
          ">
            添加
          </el-button>
        </div>
      </fieldset>
      <el-table
          :data="yygnlist"
          border
          row-key="bh"
          style="width: 100%;margin-top: 20px;"
          default-expand-all
          :tree-props="{ children: 'children' }"
      >
        <el-table-column :width="item.width"
                         :prop="item.prop"
                         :label="item.label"
                         v-for="(item, index) in options"
                         :key="index">
          <template #default="{ row }" v-if="item.prop === 'gnlxdm'">
            <el-button
                :type="row.gnlxdm == 1 ? 'danger' : 'primary'"
                :key="row.yyztdm" size="small" plain
            >
              {{ row.gnlxdm == 1 ? '菜单' : '权限' }}
            </el-button>
          </template>
          <template #default="{ row }" v-if="item.prop === 'ycbz'">
            <el-button
                :type="row.ycbzStr == '显示' ? 'success' : 'danger' "
                :key="row.yyztdm" size="small"
                plain
            >
              {{ row.ycbzStr }}
            </el-button>
          </template>
          <template #default="{ row }" v-if="item.prop === 'gnztdm'">
            <el-switch
                v-model="row.gnztdm"
                @change="gnZtdm(row)"
                active-value="1"
                inactive-value="0"
                active-text="正常"
                inactive-text="禁用"
                inline-prompt
                size="large"
            />
          </template>
          <template #default="{ row }" v-else-if="item.prop === 'action'">
            <el-button type="primary" size="small" @click="open = true, insXjgn(row.bh)">添加下级</el-button>
            <el-button type="info" size="small" plain @click="open = true, updata(row)">修改</el-button>
            <el-button type="danger" size="small" @click="delGn(row.bh)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
      </el-card>
    </el-col>
  </el-row>
  <!-- 弹出层表单 -->
  <el-dialog v-model="open" :title="title" center draggable>
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="上级功能" :label-width="formLabelWidth">
        <el-tree-select
            v-model="form.sjbh"
            :data="yygnlist"
            :props="props"
            default-expand-all
            check-strictly
        />
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth" prop="gnmc">
        <el-input v-model="form.gnmc" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth" prop="gnlxdm">
        <el-radio-group v-model="form.gnlxdm" class="ml-4">
          <el-radio label="1" size="large">菜单</el-radio>
          <el-radio label="2" size="large">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接地址" :label-width="formLabelWidth" prop="gnljdz">
        <el-input v-model="form.gnljdz" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="请求方法" :label-width="formLabelWidth" prop="gnqqff">
        <el-select v-model="form.gnqqff" placeholder="">
          <el-option label="GET" value="GET"/>
          <el-option label="POST" value="POST"/>
          <el-option label="PUT" value="PUT"/>
          <el-option label="DELETE" value="DELETE"/>
        </el-select>
      </el-form-item>
      <el-form-item label="组件路径" :label-width="formLabelWidth" prop="gnqxbz">
        <el-input v-model="form.gnqxbz" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="是否展示" :label-width="formLabelWidth" prop="ycbz">
        <el-radio-group v-model="form.ycbz" class="ml-4">
          <el-radio label="1" size="large">显示</el-radio>
          <el-radio label="2" size="large">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示顺序号" :label-width="formLabelWidth" prop="djmksxh">
        <el-input-number v-model="form.djmksxh" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="gnms">
        <el-input v-model="form.gnms" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" placeholder=""/>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="gnztdm">
        <el-radio-group v-model="form.gnztdm" class="ml-4">
          <el-radio label="1" size="large">正常</el-radio>
          <el-radio label="0" size="large">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 弹窗底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="open = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {reactive, ref} from "vue-demi"
import {ElMessage, ElMessageBox} from 'element-plus'
import {list, gnxxlist, deleteGn, updateZtdm, saveOrUpdate} from "../api/gngl"
import {options} from "./xtOptions";

//表单校验提交
const formRef = ref(null);
// 应用列表
const yylist = ref([])
// 应用状态
const yyztdm = ref([])
// 应用对应功能
const yygnlist = ref([])
// 应用功能名称
const yygnmc = ref()
// 状态 booleant
const state = ref()
// 应用编号
const yybh = ref()
// 功能信息表单
const form = reactive({
  bh: '',
  sjbh: '',
  gnmc: '',
  gnlxdm: '1',
  gnljdz: '',
  gnqqff: '',
  gnqxbz: '',
  ssyybh: '',
  ycbz: '1',
  djmksxh: '',
  gnms: '',
  gnztdm: '1'
})
// 弹窗标题
const title = ref()
// 响应结果
const responsResult = ref(false)

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
  form.ssyybh = res.data[0].bh
  gnxxlist(yybh.value).then((res) => {
    yygnlist.value = treeto(res.data)
  });
});

function rowclick1(row, event, column) {
  // 更新应用编号
  yybh.value = row.bh
  gnxxlist(row.bh).then((res) => {
    yygnlist.value = treeto(res.data)
  });
}

// 将数组数据转换为树型数据
function treeto(list) {
  let data = list.filter(father => {
    let branchArr = list.filter(child => child.sjbh == father.bh)  //返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
    return father.sjbh == 0;   //返回第一层
  });
  return data
}

const open = ref(false)
// 自定义表单lable标签宽度
const formLabelWidth = '100px'

// 更新功能状态
function gnZtdm(gnxx) {
  updateZtdm(gnxx).then((res) => {
    if (res.msg == '更新功能状态成功')
      responsResult.value = true
    else
      responsResult.value = false
    elmessage(responsResult.value, res.msg)
  });
}

// 添加下级功能
function insXjgn(bh) {
  title.value = '添加下级功能'
  form.sjbh = bh
  form.sjbhs = ''
  form.gnmc = ''
  form.gnlxdm = '1'
  form.gnljdz = ''
  form.gnqqff = ''
  form.gnqxbz = ''
  form.ycbz = '1'
  form.djmksxh = ''
  form.gnms = ''
  form.gnztdm = '1'
}

// 修改功能信息
function updata(gnxx) {
  title.value = '修改功能信息'
  form.bh = gnxx.bh
  form.sjbh = gnxx.sjbh
  form.sjbhs = gnxx.sjbhs
  form.gnmc = gnxx.gnmc
  form.gnlxdm = gnxx.gnlxdm
  form.gnljdz = gnxx.gnljdz
  form.gnqqff = gnxx.gnqqff
  form.gnqxbz = gnxx.gnqxbz
  form.ycbz = gnxx.ycbz
  form.djmksxh = gnxx.djmksxh
  form.gnms = gnxx.gnms
  form.gnztdm = gnxx.gnztdm
}
//表单规则
const rules = ref ({
  gnmc: [
    { required: true, message: '请输入名称', trigger: 'change' },
    { min:1, max:60,message: '功能名称最大长度不能超过60', trigger: 'change' }
  ],
  gnlxdm: [
    { required: true, message: '请选择功能类型', trigger: 'blur' },
    { max:8,message: '功能类型代码最大长度不能超过8', trigger: 'change' }
  ],
  gnljdz: [
    {required: true, message: '请输入链接地址', trigger: 'blur'},
    {max:128,message: '功能链接地址最大长度不能超过128', trigger: 'change'}
  ],
  gnqqff: [
    {max:128,message: '功能请求方法最大长度不能超过128', trigger: 'change'}
  ],
  gnqxbz: [
    {max:128,message: '功能请求方法最大长度不能超过128', trigger: 'change'}
  ],
  ycbz: [
    {required: true, message: '请选择是否显示', trigger: 'blur'},
    {max:8,message: '隐藏标志最大长度不能超过8', trigger: 'change' }
  ],
  djmksxh: [
    {required: true, message: '请输入顺序号', trigger: 'blur'}
  ],
  gnms: [
    {max:256,message: '功能描述最大长度不能超过256', trigger: 'change'}
  ],
  gnztdm: [
    { max:8,message: '功能状态代码最大长度不能超过8', trigger: 'change' }
  ]
})


// 表单提交
const  onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log(form)
      saveOrUpdate(JSON.stringify(form)).then((res) => {
        responsResult.value = true
        open.value = false
        elmessage(responsResult.value, res.msg)
      });
    } else {
      return false;
    }
  });
};

// 删除功能
function delGn(bh) {
  ElMessageBox.confirm(
      '确认删除此功能吗?',
      '提醒',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }
  )
      .then(() => {
        deleteGn(bh).then((res) => {
          if (res.msg == '删除功能成功')
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
  label: 'gnmc',
  children: 'children',
}

// 操作成功或失败信息提示
function elmessage(responsResult, msg) {
  if (responsResult == true) {
    ElMessageBox.confirm(
        msg,
        {
          type: 'success',
          // 不显示确认、取消按钮
          showConfirmButton: false,
          showCancelButton: false,
        }
    )
    // 刷新表格
    gnxxlist(yybh.value).then((res) => {
      yygnlist.value = treeto(res.data)
    });
    // 初始化表单
    clearaForm()
  } else {
    //  更新状态失败
    ElMessageBox.confirm(
        msg,
        {
          type: 'errror',
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
  title.value = '添加功能'
  form.bh = ''
  form.sjbh = ''
  form.gnmc = ''
  form.gnlxdm = '1'
  form.gnljdz = ''
  form.gnqqff = ''
  form.gnqxbz = ''
  form.ycbz = '1'
  form.djmksxh = ''
  form.gnms = ''
  form.gnztdm = '1'
  form.ssyybh = yybh
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
