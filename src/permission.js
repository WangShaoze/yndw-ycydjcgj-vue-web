import router from './router'
// import appRouter from './AppRouter'
import store from './store'
import {ElMessage} from 'element-plus'   // 从element-plusUI 组件库导入，用于显示提示信息，在路由守卫处理过程中，如果出现错误等情况，可以通过它向用户展示相关的提示内容
import NProgress from 'nprogress'  // 导入nprogress库，用于在页面跳转时显示加载进度条，提供给用户一个直观的页面加载反馈。
import 'nprogress/nprogress.css'  // 同时导入了其样式文件nprogress/nprogress.css，以确保进度条能够正常显示样式
import {getToken} from '@/utils/auth'
import {isHttp} from '@/utils/validate'   // 从@/utils/validate文件导入，应该是一个用于判断字符串是否是合法的 HTTP URL 格式的函数，
                                          // 在动态添加路由时会用到该函数来判断路由路径是否是 HTTP 格式，以便进行相应的处理
import {isRelogin} from '@/utils/request'  // 控制是否显示重新登录提示信息
import {checkToken, getStorageToken} from '@/utils/storageUtils'  // 用于检查令牌是否存在以及从存储中获取令牌信息

// 1.配置 NProgress
NProgress.configure({showSpinner: false});  // 对NProgress进行配置，将showSpinner属性设置为false。NProgress默认会在进度条中间显示一个旋转的小图标（spinner），通过将此属性设置为false，可以禁用这个旋转小图标，只显示单纯的进度条，可能是根据项目的具体需求和视觉设计来进行这样的配置

// 2.定义白名单和动态路由数组
const whiteList = ['/index', '/login', '/auth-redirect', '/bind', '/register'];
const accessRoutesArr = [];  // 定义了一个空数组，用于后续存储根据用户权限等信息动态生成的可访问路由表

// 3.路由前置守卫
/**
 * 是在每次路由跳转之前执行的函数，它可以根据当前路由跳转的目标路径（to）、来源路径（from）以及用户的登录状态、权限等信息，
 * 来决定是否允许路由跳转以及进行一些相关的预处理操作，比如加载进度条显示、获取用户信息、动态添加路由等
 * */
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (checkToken()) {

        // 检查目标路由是否已存在于现有路由表中（已存在令牌情况
        router.getRoutes().forEach(route => {
            if (route.path == to.path) {
                next()
            }
        })

        // 设置页面标题（已存在令牌情况）
        /*
        在 JavaScript 中，逻辑与运算符会先判断左边表达式的值。
        如果左边表达式的值为假（如false、null、undefined、0、""（空字符串）等），那么整个逻辑与表达式的值就为假，并且右边的表达式不会被执行；
        如果左边表达式的值为真，那么会继续判断右边表达式的值，并且整个逻辑与表达式的值取决于右边表达式的值
        * */
        to.meta.title && store.dispatch('settings/setTitle', to.meta.title)

        // 处理目标路由为登录页的情况（已存在令牌情况）
        /* has token*/
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            // 处理动态路由加载情况（已存在令牌情况）
            // 获取动态路由是否已加载
            const addRouters = JSON.parse(JSON.stringify(store.getters.sidebarRouters)).length
            if (addRouters == 0) {
                isRelogin.show = true
                // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetInfo').then(() => {
                    isRelogin.show = false

                    // 回调 动态路由生成的方法
                    store.dispatch('GenerateRoutes').then(accessRoutes => {
                        // if(accessRoutes.length>0){
                        // 根据roles权限生成可访问的路由表
                        accessRoutes.forEach(route => {
                            if (!isHttp(route.path)) {
                                router.addRoute(route) // 动态添加可访问路由表
                            }
                        })
                        next({...to, replace: true}) // hack方法 确保addRoutes已完成
                    })
                }).catch(err => {
                    store.dispatch('LogOut').then(() => {
                        ElMessage.error(err)
                        next({path: '/'})
                    })
                })
            } else {
                // 发现动态路由已经加载（即addRouters长度不为 0），则直接调用next()允许路由跳转，继续后续的页面加载等操作
                next()
            }
        }
    } else {
        // 处理未登录用户访问白名单路由的情况
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            // 处理未登录用户访问非白名单路由的情况
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
