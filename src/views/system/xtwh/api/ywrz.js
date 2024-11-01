import request from '@/utils/request'

// 获取信息
export function getDataList(param) {
    return request({
        url: '/yndw/xtgl/log/yndw-ycydjcgj-xtgl-log-service/V1/log/page',
        method: 'get',
        params: {
            page: param.pagenum,
            limit: param.pagesize,
            Keyword: param.Keyword,
            timestamp: param.timestamp,
        }
    })
}

//导出日志
export function exportExcel(param) {
    return request({
        url: '/yndw/xtgl/log/yndw-ycydjcgj-xtgl-log-service/V1/log/exportLog',
        method: 'post',
        params: {
            Keyword: param.Keyword,
            timestamp: param.timestamp,
        }
    })
}