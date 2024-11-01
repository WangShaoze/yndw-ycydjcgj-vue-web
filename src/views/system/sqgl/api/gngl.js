import request from '@/utils/request'
import { formatDate } from '@vueuse/shared'
// 获取信息
export function list() {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/yyxx/list',
    headers: {
      isToken: false,
    },
    method: 'get',
  })
}
// 获取应用功能信息
export function gnxxlist(yybh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/list',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      ssyybh: yybh,
    },
  })
}
// 删除功能
export function deleteGn(bh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/delete/' + bh,
    headers: {
      isToken: false,
    },
    method: 'delete',
  })
}
// 更新功能状态
export function updateZtdm(gnxx) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/updateZtdm',
    headers: {
      isToken: false,
    },
    method: 'put',
    data: gnxx,
  })
}
// 添加或更新功能
export function saveOrUpdate(gnxx) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/saveOrUpdate',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: gnxx,
  })
}
