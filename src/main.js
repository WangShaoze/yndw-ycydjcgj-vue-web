import { createApp } from 'vue'  // 从 vue 库中导入，用于创建一个 Vue 应用实例

import Cookies from 'js-cookie'   // 从 js-cookie 库导入，用于处理浏览器中的 Cookie 操作，比如读取、设置等

// ElementPlus 是一个流行的 Vue UI 组件库，这里导入用于在项目中使用其提供的丰富的 UI 组件。
// 同时导入了对应的中文语言包 locale，以便将 ElementPlus 的组件显示为中文
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/assets/styles/index.scss' // global css  导入了项目的全局 CSS 样式文件，该文件中的样式会应用到整个应用程序中。

import App from './App'          // App 是项目的根组件，从 ./App 路径导入，它是整个 Vue 应用的入口组件，包含了其他组件的挂载和布局等
import store from './store'   // 从./store 导入，通常是 Vuex 的状态管理仓库，用于存储和管理应用程序中的全局状态数据
import router from './router'   // router 从 ./router 导入，是 Vue 项目的路由模块，负责处理页面之间的路由跳转和导航逻辑。
import directive from './directive' // 从 ./directive 导入，应该是包含了项目自定义的指令，这些指令可以在 Vue 模板中添加特定的功能或行为。


// 注册指令
import plugins from './plugins' // plugins 从 ./plugins 导入，可能是一些自定义的插件，用于扩展 Vue 应用的功能。
import { download } from '@/utils/request'  // 从 @/utils/request 导入，可能用于处理文件下载等相关操作。

// svg图标 图标注册
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control  权限控制

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'

// 走马灯组件 参考文档：https://ismail9k.github.io/vue3-carousel/
// 导入了 vue3-carousel 库的相关组件 Carousel、Navigation、Slide 以及其样式文件，用于实现轮播图功能
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

//vue3-json-viewer            JsonViewer 从 vue3-json-viewer 库导入，用于在应用中展示 JSON 数据的可视化视图。
import {JsonViewer} from "vue3-json-viewer";

//视频播放           videoPlay 从 vue3-video-play 库导入，用于实现视频播放功能，并导入了其对应的样式文件
import { videoPlay } from 'vue3-video-play'
import 'vue3-video-play/dist/style.css'

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
// 轮播图组件全局挂载
app.component('carousel', Carousel)
app.component('navigation', Navigation)
app.component('slide', Slide)


//  将路由模块集成到应用中，使得应用能够实现页面之间的路由跳转和导航逻辑。
app.use(router)

// 将 Vuex 状态管理仓库集成到应用中，用于存储和管理全局状态数据。
app.use(store)

//  集成了自定义的插件，扩展了应用的功能
app.use(plugins)
// 与 ElementPlus 相关的 SVG 图标插件，用于在 ElementPlus 组件中使用 SVG 图标等功能。
app.use(elementIcons)
// 集成了视频播放功能模块，使得应用能够播放视频
app.use(videoPlay)
// 集成了 JSON 数据可视化视图功能模块，用于展示 JSON 数据。
app.use(JsonViewer)

app.component('svg-icon', SvgIcon)

directive(app)

// 使用element-plus 并且设置全局的大小
/*
* app.use(ElementPlus,...) 将 ElementPlus UI 组件库集成到应用中，并通过传入的配置对象设置了一些参数。
* locale: locale 设置了 ElementPlus 组件的语言为中文，使用了之前导入的中文语言包。
* size: Cookies.get('size') || 'default' 根据从 Cookie 中获取的 size 值来设置 ElementPlus 组件的全局大小。
* 如果 Cookie 中没有 size 值，则使用 default 作为默认大小。这种设置方式可以让用户根据自己的喜好或应用的需求来调整 ElementPlus 组件的大小。
* */
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

// 挂载 Vue 应用实例
app.mount('#app')

// D:\Devleop\code\frontCode\yndw-ycydjcgj-vue-web\src\views\system\yyckydlgl\index.vue        system/yyckydlgl/index
// D:\Devleop\code\frontCode\yndw-ycydjcgj-vue-web\src\views\system\ydlyzgl\index.vue          system/ydlyzgl/index
