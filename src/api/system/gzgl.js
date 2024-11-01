import request from '@/utils/request'

// 查询转发规则分页
export function getPageList(param) {
  return request({
    url: '/yndw/gxjk/gateway/yndw-ycydjcgj-gxjk-gateway-service/V1/zuul/getPageList',
    method: 'get',
    params: {
      page: param.page,
      limit: param.limit,
      sort: param.sort,
    },
  })
}
//添加转发规则
export function insert(data) {
  return request({
    url: '/yndw/gxjk/gateway/yndw-ycydjcgj-gxjk-gateway-service/V1/zuul/insert',
    method: 'post',
    data: data,
  })
}

//删除转发规则
export function deleteByPath(param) {
  return request({
    url: '/yndw/gxjk/gateway/yndw-ycydjcgj-gxjk-gateway-service/V1/zuul/deleteByPath',
    method: 'delete',
    params: {
      path: param.path,
    },
  })
}

//更新转发规则
export function update(data) {
  return request({
    url: '/yndw/gxjk/gateway/yndw-ycydjcgj-gxjk-gateway-service/V1/zuul/update',
    method: 'put',
    data: data,
  })
}
