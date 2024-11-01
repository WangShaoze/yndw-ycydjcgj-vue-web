import { createStore } from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'


//  创建 Vuex 状态管理仓库
/**
 * 使用createStore函数创建了一个 Vuex 状态管理仓库实例，命名为store。
 * modules属性：在创建仓库的配置对象中，通过modules属性将之前导入的各个功能模块（app、user、tagsView、permission、settings）进行了整合。
 * 这样做的好处是可以将大型应用的复杂状态按照不同的业务逻辑进行模块化管理，使得代码结构更加清晰，每个模块可以独立地维护和更新自己所负责的状态部分，
 * 同时又能在整个应用的全局状态管理体系中协同工作。
 *
 * getters属性：将导入的getters对象也添加到了创建仓库的配置对象中。这意味着在这个仓库中可以使用这些定义好的getters来获取经过处理后的状态数据。
 * 当组件需要获取特定形式的状态数据时，可以通过调用相应的getters方法来实现，而不需要在组件中直接对原始状态数据进行复杂的处理操作。
 */
const store = createStore({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings
  },
  getters
});


// 导出 Vuex 状态管理仓库
/**
 * main.js）中就可以通过import语句引入这个仓库实例，并将其集成到 Vue 应用中（如通过app.use(store)的方式），
 * 使得整个应用能够利用这个仓库来存储、管理和获取全局状态数据，从而实现不同组件之间的数据共享和状态同步等功能
 */
export default store