<template>
  <div class="user-info-head" @click="editCropper()"><img :src="options.img" title="点击上传头像" class="img-circle img-lg" /></div>
  <el-dialog :title="title" v-model="open" width="800px" append-to-body @opened="modalOpened"  @close="closeDialog">
    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="options.previews.url" :style="options.previews.img"/>
        </div>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :lg="2" :md="2">
        <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
          <el-button>
            选择
            <el-icon class="el-icon--right"><Upload /></el-icon>
          </el-button>
        </el-upload>
      </el-col>
      <el-col :lg="{span: 1, offset: 2}" :md="2">
        <el-button icon="Plus" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="Minus" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="RefreshLeft" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="RefreshRight" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{span: 2, offset: 6}" :md="2">
        <el-button type="primary" @click="uploadImg()">提 交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
// import {  } from "@/api/system/user";
import { getInfo, updateAvatar} from "../../../../api/login"

const store = useStore();
const { proxy } = getCurrentInstance();

const open = ref(false);
const visible = ref(false);
const title = ref("修改头像");

const ruleForm = ref({
  czymc: '',
  sjhm: '',
  email: '',
  xbdm:''
})


//图片裁剪数据
const options = reactive({
  img: store.getters.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {} //预览数据
});

//获取操作员
function getUser(){
  getInfo().then(res => {
    ruleForm.value = res.data
    if(res.data.avatar){
      options.img = res.data.avatar
    }else{
      options.img = "data:image/png;base64,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"
    }
  })
}
getUser()


/** 编辑头像 */
function editCropper() {
  open.value = true;
};
/** 打开弹出层结束时的回调 */
function modalOpened() {
  visible.value = true;
};
/** 覆盖默认上传行为 */
function requestUpload() {
};
/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft();
};
/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight();
};
/** 图片缩放 */
function changeScale(num) {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
};
/** 上传预处理 */
function beforeUpload(file) {
  if (file.type.indexOf("image/") == -1) {
    proxy.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      ruleForm.value.avatar = reader.result;
      options.img = reader.result;
    };
  }
};
/** 上传图片 */
function uploadImg() {
  proxy.$refs.cropper.getCropBlob(data => {
      updateAvatar(ruleForm.value).then(response => {
      open.value = false;
      getUser()
      store.commit("SET_AVATAR", options.img);
      proxy.$modal.msgSuccess("修改成功");
      visible.value = false;
    });
  });
};

/** 实时预览 */
function realTime(data) {
  options.previews = data;
};
/** 关闭窗口 */
function closeDialog() {
  options.img = store.getters.avatar;
  options.visible = false;
};
</script>

<style lang='scss' scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>