import {getUserDetailsByCurrentLoginUser, login, logout, getInfo} from '@/api/login'
/**
 * 从@/api/login模块导入了几个与用户登录、获取用户详细信息以及退出登录相关的函数：
 *      getUserDetailsByCurrentLoginUser：用于获取当前登录用户的详细信息，可能包括用户的角色、权限等更多细节内容。
 *      login：用于处理用户登录操作，应该会向服务器发送登录请求并获取相应的登录结果，比如获取到登录令牌（token）等。
 *      logout：用于处理用户退出系统的操作，会向服务器发送退出请求以完成相关的清理和注销工作。
 *      getInfo：用于获取用户的一些基本信息，可能包括用户名、头像等基础信息。
 */

import {getToken, setToken, removeToken} from '@/utils/auth'
/**
 * 从@/utils/auth模块导入了几个与处理令牌（token）相关的函数：
 *          getToken：用于获取存储的令牌信息，可能是从浏览器的本地存储（如localStorage或sessionStorage）或者 Cookie 中获取。这里是 Cookie
 *          setToken：用于设置令牌信息，将获取到的令牌存储到合适的地方，以便后续请求可以携带该令牌进行身份验证等操作。
 *          removeToken：用于移除存储的令牌信息，在用户退出登录或者令牌过期等情况下使用，以确保用户的身份验证状态被正确清理。
 */

import {delToken, putJsonData, getStorageToken} from '@/utils/storageUtils'

/**
 * 从@/utils/storageUtils模块导入了几个与存储操作相关的函数：
 *        delToken：可能是专门用于删除与令牌相关的存储数据，具体的删除目标可能取决于其内部实现，
 *                  比如删除localStorage或sessionStorage中的特定令牌相关数据。
 *        putJsonData：用于将数据以 JSON 格式存储到某个存储介质中，在这里可能用于存储登录后获取到的令牌等数据。
 *        getStorageToken：用于获取存储中的令牌信息，具体的获取来源可能是localStorage、sessionStorage或者其他定义好的存储位置。
 *
 */

// 定义默认头像及用户状态初始值
const defAva = "data:image/png;base64,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"

const user = {

    // 定义用户模块的初始状态
    state: {
        token: getStorageToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    },

    // 定义变更用户状态的方法（mutations:{突变}）
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },


        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    // 定义触发变更用户状态操作的方法（actions）
    actions: {
        // 登录
        Login({commit}, userInfo) {

            const username = userInfo.username
            const password = userInfo.password

            const validCode = userInfo.validCode  // 验证码

            const deviceId = userInfo.deviceId    // 设备 ID
            const grant_type = userInfo.grant_type   // 授权类型，password_code

            // 创建一个Promise对象，在其中调用login函数（前面从@/api/login模块导入）并传入解构出的相关登录信息
            return new Promise((resolve, reject) => {

                login(username, password, validCode, deviceId, grant_type).then(res => {   // 当login函数执行成功并返回结果后（通过.then方法处理）
                    /**
                     * 首先使用putJsonData('token', res.data)
                     *          将获取到的登录结果中的令牌数据
                     *          以 JSON 格式存储到某个存储介质中（具体存储位置由putJsonData函数内部实现决定，可能是 localStorage 等）。
                     *
                     * 接着使用 setToken(res.data) 将获取到的登录结果中的令牌数据 存储到Cookie中
                     *
                     * 最后通过commit('SET_TOKEN', res.data)调用SET_TOKEN这个mutations方法，将获取到的令牌更新到用户模块的 state.token 状态中，
                     * 完成登录操作后令牌状态的更新，并且通过resolve()来表示登录操作成功完成，可以继续后续的流程（比如跳转到首页等操作）。
                     * 如果login函数执行过程中出现错误，则通过 reject(error) 来拒绝这个Promise，并将错误信息传递出去，以便在调用Login方法的地方进行错误处理。
                     */

                    putJsonData('token', res.data)  // 将获取到的登录结果中的令牌数据 存储到 localStorage 中

                    setToken(res.data)  // 将获取到的登录结果中的令牌数据 存储到 Cookie 中

                    commit('SET_TOKEN', res.data)  // 将获取到的令牌更新到用户模块的 state.token 状态中

                    resolve()  // 表示登录操作成功完成
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({commit, state}) {

            return new Promise((resolve, reject) => {
                // 调用getInfo函数（从@/api/getInfo 模块导入）来获取用户的一些基本信息。当获取成功并返回结果后（通过.then方法处理）
                getInfo().then(res => {
                    const user = res.data      // 获取到的用户数据

                    localStorage.setItem('loginCzyxx', JSON.stringify(user))    // 在本地存储存储中获取存一个当前登录用户的数据

                    const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;  // 三目运算符判断头像是不是有数据，
                                                                                       // 没有就给默认的 defAva，用户数据中有就使用用户数据中的头像
                    // 调用 获取当前用户登录用户数据的详细信息的方法 ，如果用户的详细信息获取成功并返回结果后 （通过.then方法处理）
                    getUserDetailsByCurrentLoginUser().then(res => {

                        commit('SET_ROLES', res.data.securityRoleList)       //  触发用户角色更新
                        commit('SET_PERMISSIONS', res.data.permissions)      // 触发用户权限更新
                    })

                    commit('SET_NAME', user.czymc)    // 触发用户名更新
                    commit('SET_AVATAR', avatar)      // 触发用户套箱更新
                    resolve(res)       // 表示 用户信息获取 完成

                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({commit, state}) {
            // 当用户退出系统的时候，创建一个 Promise 调用 logout
            return new Promise((resolve, reject) => {

                // 调用 logout 函数（从@/api/logout 模块导入）移除用户的一些基本信息。当后端处理好登出后（通过.then方法处理）
                logout(state.token).then(() => {

                    commit('SET_TOKEN', '')   // localStorage 清除用户令牌数据
                    commit('SET_ROLES', [])   // 清除用户角色数据
                    commit('SET_PERMISSIONS', [])  // 清除用户权限数据

                    removeToken()  // Cookie 清除用户令牌数据

                    // 清除本地存储
                    localStorage.clear()

                    resolve()   // 表示 用户登出操作 完成

                    delToken()  // 清除本地存储

                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()   // Cookie 清除用户令牌数据
                // 清除本地存储
                localStorage.clear()
                resolve()
            })
        }
    }
}

// 导出用户模块
export default user
/**
 * 将整个定义好的用户模块user通过export default语句导出。
 * 这样在其他文件（如/src/store/index.js）中就可以通过import语句引入这个用户模块，并将其整合到整个 Vuex 状态管理仓库中，从而实现对应用中用户相关状态的管理，
 * 包括用户登录、获取信息、退出登录等操作过程中的状态更新和维护。
**/
