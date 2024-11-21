import request from '@/utils/request'


// 更新阈值
export const updateYuJinZhi = (data) => {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/ydlyzgl/updateYuJinZhi',
        method: 'post',
        data: data
    })
}

// 获取阈值
export const searchYuJinZhi = () => {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/ydlyzgl/searchYuJinZhi',
        method: 'post',
    })
}