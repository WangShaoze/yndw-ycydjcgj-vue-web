import request from '@/utils/request'

// 获取操作员信息
export function list() {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/list',
        headers: {
            isToken: false,
        },
        method: 'get',
    })
}

//渲染操作员授权表格数据
export function getDataList(param) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/page',
        method: 'get',
        params: {
            zzbh: param.zzbh,
            type: '2',
            czymc: param.czymc,
            page: param.pagenum,
            limit: param.pagesize,
        },
    })
}

// 获取岗位信息
export function gwList(param) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/list',
        headers: {
            isToken: false
        },
        method: 'get',
        params: {
            zzbh: param.zzbh,
            gwmc: param.gwmc
        }
    })
}

//添加或者跟新岗位
export function saveOrUpdate(data) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/saveOrUpdate',
        method: 'post',
        data: data
    })
}


//删除操作员
export function deleteBh(bh) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/delete/' + bh,
        method: 'delete'
    })
}

//重置密码
export function resetDlmm(bh) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/resetDlmm/' + bh,
        method: 'put'
    })
}