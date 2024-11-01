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

//渲染岗位授权表格数据
export function getDataList(bh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/page',
    method: 'get',
    params: {
      zzbh: bh,
      type: '2',
    },
  })
}

// 获取角色已经分配功能
export function getGwjsList(jsbh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/getGwjsList',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      bh: jsbh,
    },
  })
}

// 角色分配功能
export function setGnxxToJsxx(gwbh, jsbhs) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/setJsxxToGwxx',
    headers: {
      isToken: false,
    },
    method: 'put',
    params: {
      gwbh: gwbh,
      jsbhs: jsbhs,
    },
  })
}

// 添加或修改角色
export function saveOrUpdate(gwxx) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/saveOrUpdate',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: gwxx,
  })
}
