import request from '@/utils/request'


// 非模糊查询
const search = (data) => {
    console.log(data)
    return request({
        url: '/yndw/xtgl/htgl/yndw-ycydjcgj-xtgl-htgl-service/V1/ycckyhgl/searchYYCKUser',
        method: 'post',
        data: data
    })
}

// 通过供电所信息查找
export const searchDataBySuo = (data) => {
    console.log("searchDataBySuo")
    return search(data)
}

// 通过供电局信息查找
export const searchDataByJu = (data) => {
    console.log("searchDataByJu")
    return search(data)
}

// 通过文山供电局信息查找
export const searchDataByZhongJu = (data) => {
    console.log("searchDataByZhongJu")
    return search(data)
}

// 通过用户名和用户编号模糊匹配查找
export const searchDataByLike = (data) => {
    console.log("searchDataByLike")
    return request({
        url: '/yndw/xtgl/htgl/yndw-ycydjcgj-xtgl-htgl-service/V1/ycckyhgl/searchYYCKUserLike',
        method: 'post',
        data: data
    })
}

// 添加用户
export const addNewUser = (data) => {
    console.log("addNewUser")
    console.log(data)
    return request({
        url: '/yndw/xtgl/htgl/yndw-ycydjcgj-xtgl-htgl-service/V1/ycckyhgl/saveOrUpdateYYCKUser',
        method: 'post',
        data: data
    })
}

// 用户信息修改
export const updateUserInfo = (data) => {
    console.log("updateUserInfo")
    console.log(data)
    return request({
        url: '/yndw/xtgl/htgl/yndw-ycydjcgj-xtgl-htgl-service/V1/ycckyhgl/saveOrUpdateYYCKUser',
        method: 'post',
        data: data
    })
}

// 删除用户
export const delUser = (data) => {
    console.log("delUser")
    console.log(data)
    return request({
        url: '/yndw/xtgl/htgl/yndw-ycydjcgj-xtgl-htgl-service/V1/ycckyhgl/deleteYYCKUser',
        method: 'post',
        data: data
    })
}


