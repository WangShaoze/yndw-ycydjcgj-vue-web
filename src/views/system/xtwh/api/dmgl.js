import request from '@/utils/request'
import { formatDate } from '@vueuse/shared'
// 获取代码分类列表
export function dmflList(dmflmc) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmfl/list',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      dmflmc: dmflmc,
    },
  })
}
// 获取代码分类明细列表
export function dmflmxList(dmflbm) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmflmx/list',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      dmflbm: dmflbm,
    },
  })
}
// 更新功能状态
export function updateZtdm(dmmx) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmflmx/updateZtdm',
    headers: {
      isToken: false,
    },
    method: 'put',
    data: dmmx,
  })
}

//添加或者更新代码分类
export function saveOrUpdateDmfl(data) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmfl/saveOrUpdate',
    method: 'post',
    data: data
  })
}

//添加或者更新代码分类明细
export function saveOrUpdate(data) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmflmx/saveOrUpdate',
    method: 'post',
    data: data
  })
}

//删除代码分类
export function deleteDmflByBh(bh) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmfl/delete/' + bh,
    method: 'delete'
  })
}
//删除代码
export function deleteDmByBh(bh) {
  return request({
    url: '/yndw/xtgl/dm/yndw-ycydjcgj-xtgl-dm-service/V1/dmflmx/delete/' + bh,
    method: 'delete'
  })
}