import request from '@/utils/request'

// 获取信息
export function getDataList(param) {
    return request({
        url: '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/page',
        method: 'get',
        params: {
            page: param.pagenum,
            limit: param.pagesize,
            fjmc: param.fjmc,
        }
    })
}

//上传文件
export function uploadFile(data) {
    return request({
        url:'/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/upload',
        method:'post',
        data:data
    })
}



//删除文件
export function deleteBh(bh){
    return request({
        url:'/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/delete/'+bh,
        method:'delete'
    })
}

//下载文件
export function downloadBh(bh){
    return request({
      url:'/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/download/'+bh,
        method:'get',
        responseType: 'blob',
    })
}
