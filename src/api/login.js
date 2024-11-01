import request from '@/utils/request'
/**
 * 登录时: 发送请求的模块
 * */

// 登录方法
export function login(username, password, validCode, deviceId, grant_type) {
    let config = {
        //formData  提交请求头有两种 multipart/form-data  和 application/x-www-form-urlencoded
        // multipart/form-data   用于type=file 的input提交
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    let formData = new FormData()
    //参数
    formData.append('username', username)
    formData.append('password', password)
    formData.append('validCode', validCode)
    formData.append('deviceId', deviceId)
    formData.append('grant_type', grant_type)

    return request({
        url: '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/oauth2/login',
        // headers: {
        //     isToken: false,
        // },
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Basic ' + window.btoa('webApp:webApp'),
        },
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/register',
        headers: {
            isToken: false,
        },
        method: 'post',
        data: data,
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/getCzyxxByCurrentLoginUser',
        method: 'get',
    })
}

// 获取登录用户详细信息
export function getUserDetailsByCurrentLoginUser() {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/getUserDetailsByCurrentLoginUser',
        method: 'get',
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/oauth2/logout',
        method: 'post',
    })
}

// 获取验证码
export function getCodeImg(deviceId) {
    return request({
        url:
            '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/validataCode/genGifCode/' +
            deviceId,
        headers: {
            isToken: false,
        },
        method: 'get',
        timeout: 20000,
        responseType: 'blob',
    })
}

// 解析用户信息
export function parseToken(token, csrf) {
    return request({
        url: '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/jwt/getUserName',
        method: 'get',
        params: {
            token: token,
            csrfToken: csrf,
        },
    })
}

//修改操作员信息
export function saveOrUpdate(data) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/saveOrUpdate',
        method: 'post',
        data: data,
    })
}

//更新密码
export function updateDlmm(oldDlmm, newDlmm) {
    const data = {
        oldDlmm,
        newDlmm,
    }
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/updateDlmm',
        method: 'put',
        data: data,
    })
}


// 更新头像
export function updateAvatar(data) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/updateAvatar',
        method: 'put',
        data: data,
    })
}
