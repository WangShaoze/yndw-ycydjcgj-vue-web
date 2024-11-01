import request from '@/utils/request'

// 获取信息
export function selectCzyxxBYZzbh(zzbh) {
    return request({
        url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/selectCzyxxBYZzbh',
        method: 'get',
        params: {
            zzbh:zzbh
        }
    })
}

export function checkDefaultDlmm(){
    return request(({
        url:'/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/checkDefaultDlmm',
        method:'get'
    }))
}
