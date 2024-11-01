import request from '@/utils/request'

// 获取信息
export function getDataList(param) {
    return request({
        url: '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/loginLog/page',
        method: 'get',
        params: {
            page: param.pagenum,
            limit: param.pagesize,
            searchword: param.searchword,
            dlsj: param.dlsj,
        }
    })
}

//导出日志
export function exportExcel(param) {
    return request({
        url: '/yndw/oauth/yndw-ycydjcgj-oauth-service/V1/loginLog/exportLog',
        method: 'post',
        params: {
            searchword: param.searchword,
            dlsj: param.dlsj,
        }
    })
}