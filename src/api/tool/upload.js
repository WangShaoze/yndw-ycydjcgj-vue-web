import request from '@/utils/request'
//上传图片到minio
export function uploadImage(data) {
  return request({
    url: '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/upload',
    method: 'post',
    data: data,
  })
}

//预览图片
export function previewImage(bh) {
  return request({
    url:
      '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/getPreviewUrl/' +
      bh,
    method: 'get',
  })
}

//上传文件到nexus
export function uploadComponent(data) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyqx/uploadComponent',
    method: 'post',
    data: data,
  })
}

//上传文件到nexus
export function uploadFile(data) {
  return request({
    url: '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/upload/',
    method: 'post',
    data: data,
  })
}

//根据文件存储路径获取编号
export function selectFjccljByBh(fjcclj) {
  return request({
    url:
      '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/selectFjccljByBh/' +
      fjcclj,
    method: 'get',
  })
}
//删除文件
export function deleteFile(bh) {
  return request({
    url: '/yndw/xtgl/file/yndw-ycydjcgj-xtgl-file-service/V1/fjxx/delete/' + bh,
    method: 'Delete',
  })
}
