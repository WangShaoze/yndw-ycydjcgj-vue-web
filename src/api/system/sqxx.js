import request from '@/utils/request'

// 查询未授权应用
export function selectSqxxBySqlx(param) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/spgl/selectSqxxBySqlx',
    method: 'get',
    params: {
      page: param.pagenum,
      limit: param.pagesize,
      sqlx: param.sqlx,
    },
  })
}
