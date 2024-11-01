/**
 * Cookies从js-cookie库导入，用于在浏览器端操作 Cookie。
 * 通过它可以方便地读取、设置和删除 Cookie 信息，在本模块中主要用于存储和获取与应用界面相关的一些设置状态，比如侧边栏的打开状态、组件大小等
 */
import Cookies from 'js-cookie'

// 定义初始状态, 定义了一个名为state的对象，它代表了这个模块所管理的应用状态的初始值。
/**
 * sidebar：这是一个嵌套对象，用于管理侧边栏相关的状态。
 *      opened：通过Cookies.get('sidebarStatus')尝试从 Cookie 中获取侧边栏的打开状态值。
 *             如果能获取到值，会先将其转换为数字（通过+操作符），再转换为布尔值（通过!!操作符）；如果获取不到，就默认设置为true，即侧边栏初始是打开的。
 *      withoutAnimation：初始设置为false，表示侧边栏切换时默认是有动画效果的。
 *                       当设置为true时，可能意味着侧边栏切换时不显示动画，比如在某些特定的操作场景下需要快速切换侧边栏而不希望有动画干扰。
 *      hide：初始设置为false，表示侧边栏初始是显示的。当设置为true时，就会隐藏侧边栏。
 * device：设置为desktop，可能代表当前应用所适配的设备类型初始设定为桌面端。在后续代码中，
 *         可能会根据实际情况（比如通过检测用户设备或者用户手动切换）来改变这个值，以适应不同设备的显示需求。
 * size：通过 Cookies.get('size') || 'default'
 *       从 Cookie 中获取组件的大小设置，
 *       如果获取不到就默认设置为default。这个值可能用于设置应用中某些 UI 组件的大小，比如按钮、输入框等的大小规格
 *
 * @type {{size: (*|string), sidebar: {hide: boolean, opened: (boolean|boolean), withoutAnimation: boolean}, device: string}}
 */
const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,          // 三目运算符
        withoutAnimation: false,
        hide: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'default'
}


// 定义变更状态的方法 mutations
/**
 * mutations是 Vuex 中用于同步修改状态的方法集合。在这个模块中，定义了以下几个变更状态的mutations方法：
 *      TOGGLE_SIDEBAR：用于切换侧边栏的打开和关闭状态。  toggle sidebar   --> toggle(切换)
 *                首先判断state.sidebar.hide是否为true，如果是，就直接返回false，表示在侧边栏隐藏的情况下不进行切换操作。
 *                然后将state.sidebar.opened的值取反，实现打开或关闭侧边栏的切换。
 *                同时将state.sidebar.withoutAnimation设置为 false，确保切换时有动画效果（除非之前有特殊设置使其为true）。
 *                最后根据state.sidebar.opened的新值，通过Cookies.set('sidebarStatus', 1)或 Cookies.set('sidebarStatus', 0)
 *                将侧边栏的打开状态值更新到 Cookie 中，以便下次页面加载时能获取到正确的状态。
 *
 * CLOSE_SIDEBAR：用于关闭侧边栏。
 *              先通过Cookies.set('sidebarStatus', 0)将侧边栏的打开状态值在 Cookie 中设置为关闭（0）。
 *              然后将state.sidebar.opened设置为false，直接关闭侧边栏。
 *              同时根据传入的参数withoutAnimation的值来设置state.sidebar.withoutAnimation，决定侧边栏关闭时是否有动画效果。

 * TOGGLE_DEVICE：用于切换应用所适配的设备类型。直接将传入的device参数赋值给state.device，实现设备类型的切换。
 *
 * SET_SIZE：用于设置应用中组件的大小。
 *          将传入的size参数赋值给state.size，更新组件大小的状态值。
 *          同时通过Cookies.set('size', size)将新的大小值更新到 Cookie 中，以便后续页面加载时能获取到正确的组件大小设置。
 *
 * SET_SIDEBAR_HIDE：用于设置侧边栏的隐藏状态。直接将传入的status参数赋值给state.sidebar.hide，实现侧边栏隐藏或显示的设置。
 *
 * @type {{CLOSE_SIDEBAR: mutations.CLOSE_SIDEBAR, SET_SIZE: mutations.SET_SIZE, SET_SIDEBAR_HIDE: mutations.SET_SIDEBAR_HIDE, TOGGLE_SIDEBAR: ((function(*): (boolean|undefined))|*), TOGGLE_DEVICE: mutations.TOGGLE_DEVICE}}
 */
const mutations = {
    TOGGLE_SIDEBAR: state => {
        if (state.sidebar.hide) {
            return false;
        }
        state.sidebar.opened = !state.sidebar.opened    //   取反
        state.sidebar.withoutAnimation = false   // 有动画
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    },
    SET_SIDEBAR_HIDE: (state, status) => {
        state.sidebar.hide = status
    }
}

// 定义触发变更状态操作的方法 actions
/**
 * actions是 Vuex 中用于触发mutations来间接修改状态的方法集合，
 *        通常用于处理异步操作或者在触发mutations之前进行一些额外的逻辑处理（虽然这里的示例主要是同步操作，但遵循了 Vuex 的规范写法）。
 *        在这个模块中，定义了以下几个触发变更状态操作的actions方法：
 *
 * toggleSideBar：通过调用 commit('TOGGLE_SIDEBAR') 触发 TOGGLE_SIDEBAR这个mutations方法，从而实现侧边栏的打开和关闭状态切换。
 *
 * closeSideBar：接收一个包含withoutAnimation参数的对象，然后通过调用commit('CLOSE_SIDEBAR', withoutAnimation)触发CLOSE_SIDEBAR
 *              这个mutations方法，实现关闭侧边栏的操作，并根据传入的参数设置是否有动画效果。
 * toggleDevice：接收一个device参数，通过调用commit('TOGGLE_DEVICE', device)触发TOGGLE_DEVICE这个mutations方法，
 *              实现应用所适配的设备类型的切换。
 * setSize：接收一个size参数，通过调用commit('SET_SIZE', size)触发SET_SIZE这个mutations方法，实现应用中组件大小的设置。
 *
 * toggleSideBarHide：接收一个status参数，通过调用commit('SET_SIDEBAR_HIDE', status)触发SET_SIDEBAR_HIDE这个mutations方法，
 *                   实现侧边栏隐藏或显示的设置。
 *
 * @type {{toggleSideBarHide({commit: *}, *): void, setSize({commit: *}, *): void, toggleSideBar({commit: *}): void, closeSideBar({commit: *}, {withoutAnimation: *}): void, toggleDevice({commit: *}, *): void}}
 */
const actions = {
    toggleSideBar({commit}) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({commit}, {withoutAnimation}) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({commit}, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setSize({commit}, size) {
        commit('SET_SIZE', size)
    },
    toggleSideBarHide({commit}, status) {
        commit('SET_SIDEBAR_HIDE', status)
    }
}

//导出模块配置
/**
 * 将这个模块的配置以对象的形式导出。其中：
 * namespaced: true：表示这个模块是有命名空间的。
 * 在 Vuex 中，设置命名空间可以避免不同模块之间的状态、mutations和actions等的命名冲突，使得每个模块可以更加独立地管理自己的状态和操作，
 * 当在组件中调用这个模块的mutations和actions时，需要带上模块的命名空间来明确是哪个模块的操作。
 *
 * state、mutations、actions：分别将之前定义的初始状态、变更状态的方法和触发变更状态操作的方法包含在导出的对象中，
 * 以便在其他地方（比如/src/store/index.js文件）可以引入并整合到整个 Vuex 状态管理仓库中，从而实现对应用中与这个模块相关的状态的管理
 */
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
