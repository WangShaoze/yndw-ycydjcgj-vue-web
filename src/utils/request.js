import axios from 'axios'   // 从axios库导入，用于发送 HTTP 请求，是一个流行的用于在浏览器和 Node.js 环境中进行 HTTP 通信的库
import {
    ElNotification,
    ElMessageBox,
    ElMessage,
    ElLoading,
} from 'element-plus'   // 从element-plusUI 组件库导入，分别用于显示通知、弹出确认框、显示提示信息和显示加载动画等，以便在请求过程中给用户提供相应的反馈信息。

import store from '@/store'
import errorCode from '@/utils/errorCode'   // 从@/utils/errorCode导入，应该是一个包含了各种错误代码及其对应错误信息的对象，用于根据后端返回的错误代码来获取友好的错误提示信息展示给用户
import {tansParams, blobValidate} from '@/utils/ruoyi'   // tansParams函数可能用于对请求参数进行某种转换操作
                                                         // （比如将对象形式的参数转换为适合 URL 传递的格式等），
                                                         // blobValidate函数可能用于验证某种与二进制数据（如 Blob 类型数据）相关的条件
                                                         // （比如验证是否是合法的登录相关的二进制数据等，具体用途需结合后续代码分析）。

import cache from '@/plugins/cache'   // 从@/plugins/cache导入，可能是一个自定义的缓存插件，用于在本地缓存一些数据，如在代码中用于缓存请求相关的信息以防止数据重复提交等操作

import {saveAs} from 'file-saver'
import {
    getCsrfToken,
    getToken,
    putCsrfToken,
    checkToken,
    delToken,
} from '@/utils/storageUtils'


let downloadLoadingInstance  // 定义下载加载实例


// 是否显示重新登录
export let isRelogin = {show: false}

// 使用axios发送的所有请求设置默认的请求体数据格式为 JSON，并且字符编码为 UTF - 8。
// 这样在后续发送请求时，如果没有特别指定请求头中的Content - Type，就会使用这个默认设置，使得服务器能够正确地理解请求体中的数据格式和编码方式。
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    /**
     * 值是https://api.example.com，而要发送一个获取用户信息的请求，假设对应的 API 端点是/users/getInfo，
     * 那么实际发送请求时，只需要使用service.get('/users/getInfo')这样的形式，axios会自动将baseURL和相对路径拼接起来，
     * 形成完整的请求 URL https://api.example.com/users/getInfo。这样可以更方便地管理和维护请求的 URL，
     * 尤其是在项目中有多个不同的 API 端点需要调用时，只需要统一修改baseURL的值就可以切换到不同环境下的 API 服务地址
     * */
    // 超时
    timeout: 10000,
})

// request拦截器
/**
 * 定义了axios实例service的请求拦截器。
 * 请求拦截器的主要作用是在发送请求之前对请求进行一些预处理操作，比如设置请求头、处理请求参数、防止数据重复提交等，
 * 以确保请求符合服务器的要求并且能够正确地被处理，同时也可以在这里进行一些与业务逻辑相关的判断，如检查登录状态等
 * */
service.interceptors.request.use(
    (config) => {

        // 1. 检查是否需要设置令牌和防止重复提交的标志获取
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false

        // 是否需要防止数据重复提交
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false

        // 2. 处理登录状态和设置请求头令牌
        if (config.url.indexOf("validataCode/genGifCode") == -1 && config.url.indexOf("oauth2/login") == -1) {
            if (checkToken()) {
                config.headers['X-CSRF-TOKEN'] = getCsrfToken() // 让每个请求携带自定义token 请根据实际情况自行修改
                config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
            } else {
                ElMessageBox.alert('登录状态已过期，请重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    callback: () => {
                        isRelogin.show = false
                        delToken()
                        location.href = '/login'
                    },
                })
                    .then(() => {
                        isRelogin.show = false
                        delToken()
                        location.href = '/login'
                    })
                    .catch(() => {
                        isRelogin.show = false
                    })
            }
        }


        // 3. 处理get请求参数和响应类型设置
        // get请求映射params参数
        if (config.method === 'get' && config.params) {
            //在这里判断一下 如果是请求文件流的接口，就需要在responseType改为blob类型
            if (config.url.indexOf("exportLog") != -1) {
                config.responseType = 'blob'
            }
            let url = config.url + '?' + tansParams(config.params)
            url = url.slice(0, -1)
            config.params = {}
            config.url = url
        }

        // 4. 处理post或put请求参数、防止重复提交及缓存相关操作
        if (
            !isRepeatSubmit &&
            (config.method === 'post' || config.method === 'put')
        ) {
            //在这里判断一下 如果是请求文件流的接口，就需要在responseType改为blob类型
            if (config.url.indexOf("exportLog") != -1) {
                config.responseType = 'blob'
            }
            if (config.params) {
                config.url = config.url + "?" + tansParams(config.params);
                config.params = {};
                config.url = config.url.slice(0, -1)
            }

            const requestObj = {
                url: config.url,
                data:
                    typeof config.data === 'object'
                        ? JSON.stringify(config.data)
                        : config.data,
                time: new Date().getTime(),
            }

            const sessionObj = cache.session.getJSON('sessionObj')
            if (
                sessionObj === undefined ||
                sessionObj === null ||
                sessionObj === ''
            ) {
                cache.session.setJSON('sessionObj', requestObj)
            } else {
                const s_url = sessionObj.url // 请求地址
                const s_data = sessionObj.data // 请求数据
                const s_time = sessionObj.time // 请求时间
                const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
                if (
                    s_data === requestObj.data &&
                    requestObj.time - s_time < interval &&
                    s_url === requestObj.url
                ) {
                    const message = '数据正在处理，请勿重复提交'
                    // console.warn(`[${s_url}]: ` + message)
                    return Promise.reject(new Error(message))
                } else {
                    cache.session.setJSON('sessionObj', requestObj)
                }
            }
        }
        return config
    },
    (error) => {
        // 5. 错误处理
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        let storageKey = 'yndw-ycydjcgj-web-dev'
        let storageVal = {}
        if ('x-csrf-token' in res.headers) {
            storageVal.csrfToken = res.headers['x-csrf-token']                // 跨站请求token
            // if(){

            // }else{
            putCsrfToken(storageVal.csrfToken)
            // }
            // localStorage.setItem(storageKey,JSON.stringify(storageVal))
        }

        // 未设置状态码则默认成功状态
        const code = res.data.code || 200
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']

        // 二进制数据则直接返回
        if (
            res.request.responseType === 'blob' ||
            res.request.responseType === 'arraybuffer'
        ) {
            return res.data
        }

        if (
            code === 401 ||
            (!res.data.msg == undefined &&
                JSON.stringify(res.data.msg).length > 0 &&
                res.data.msg.indexOf('Invalid access token') > 0)
        ) {
            // if (isRelogin.show) {
            isRelogin.show = true
            ElMessageBox.alert('登录状态已过期，请重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                callback: () => {
                    isRelogin.show = false
                    delToken()
                    location.href = '/login'
                },
            })
                .then(() => {
                    isRelogin.show = false
                    delToken()
                    location.href = '/login'
                })
                .catch(() => {
                    isRelogin.show = false
                })
            // }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
            ElMessage({
                message: msg,
                type: 'error',
            })
            return Promise.reject(new Error(msg))
        } else if (code !== 200) {
            ElNotification.error({
                title: msg,
            })
            return Promise.reject('error')
        } else if (code == 1) {
            if (msg == 'Access is denied') {
                ElNotification.error({
                    title: '此功能或接口未授权！',
                })
            }
            return Promise.reject('error')
        } else {
            return Promise.resolve(res.data)
        }
    },
    (error) => {
        let {message} = error
        if (message == 'Network Error') {
            message = '后端接口连接异常'
            ElMessage({
                message: message,
                type: 'error',
                duration: 5 * 1000,
            })
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
            ElMessage({
                message: message,
                type: 'error',
                duration: 5 * 1000,
            })
        } else if (message.includes('Request failed with status code')) {
            const msg = error.response.data.msg
            message = '系统接口' + message.substr(message.length - 3) + '异常'
            ElMessage({
                message: msg,
                type: 'error',
                duration: 5 * 1000,
            })
        }

        return Promise.reject(error)
    }
)

// 通用下载方法
export function download(url, params, filename) {
    downloadLoadingInstance = ElLoading.service({
        text: '正在下载数据，请稍候',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    return service
        .post(url, params, {
            transformRequest: [
                (params) => {
                    return tansParams(params)
                },
            ],
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'blob',
        })
        .then(async (data) => {
            const isLogin = await blobValidate(data)
            if (isLogin) {
                const blob = new Blob([data])
                saveAs(blob, filename)
            } else {
                const resText = await data.text()
                const rspObj = JSON.parse(resText)
                const errMsg =
                    errorCode[rspObj.code] || rspObj.msg || errorCode['default']
                ElMessage.error(errMsg)
            }
            downloadLoadingInstance.close()
        })
        .catch((r) => {
            ElMessage.error('下载文件出现错误，请联系管理员！')
            downloadLoadingInstance.close()
        })
}

export default service
