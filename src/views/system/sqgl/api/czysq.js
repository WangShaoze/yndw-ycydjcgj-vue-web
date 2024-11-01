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

//渲染操作员授权表格数据
export function getDataList(param) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/page',
    method: 'get',
    params: {
      zzbh: param.zzbh,
      type: '2',
      czymc: param.czymc,
      page: param.pagenum,
      limit: param.pagesize,
    },
  })
}

//获取操作员已分配功能
export function getCzyGnList(bh) {
  return request({
    url:
      '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyqx/getCzyGnList/' +
      bh,
    method: 'get',
  })
}

//为操作员分配角色功能之外的功能
export function setGnxxToCzy(czybh, gnxxList) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyqx/setGnxxToCzy',
    method: 'put',
    headers: {
      isToken: false,
    },
    data: {
      czybh: czybh,
      gnxxList: gnxxList,
    }
  })
}

//操作员导出功能
export function exportExcel(bh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/czyxx/export',
    method: 'post',
    params: {
      zzbh: bh,
      type: 2,
    },
  })
}
