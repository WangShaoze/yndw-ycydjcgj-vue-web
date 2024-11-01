import request from '@/utils/request'

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

// 获取应用角色信息js
export function jsxxlist(yybh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/list',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      ssyybh: yybh,
    },
  })
}

// 更新角色状态
export function updateZtdm(jsxx) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/updateZtdm',
    headers: {
      isToken: false,
    },
    method: 'put',
    data: jsxx,
  })
}

// 添加或修改角色
export function saveOrUpdate(jsxx) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/saveOrUpdate',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: jsxx,
  })
}

// 删除角色
export function deleteJs(bh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/delete/' + bh,
    headers: {
      isToken: false,
    },
    method: 'delete',
  })
}

// 获取角色分配功能
export function getJsGnList(yybh, jsbh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/getJsGnList',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      bh: jsbh,
      ssyybh: yybh,
    },
  })
}

// 角色分配功能
export function setGnxxToJsxx(jsbh, gnbhs) {
  let obj = new Object()
  obj.jsbh = jsbh
  obj.gnbhs = gnbhs
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/jsxx/setGnxxToJsxx',
    headers: {
      isToken: false
    },
    method: 'post',
    data: obj,
  })
}
