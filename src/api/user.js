import request from '@/utils/request'

//修改个人信息
export function saveOrUpdate(editInfo) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/saveOrUpdate',
    method: 'post',
    data: editInfo,
  })
}
