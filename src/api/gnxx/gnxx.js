import request from '@/utils/request'

//查询功能组
export function getGnzxx(param) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/zdygnz/getGnzByYhbh',
    method: 'get',
    params: {
      page: param.pagenum,
      limit: param.pagesize,
    },
  })
}
//查询功能组下的功能
export function getGnj(gnzbh) {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/getGnxxBygnzbh',
    method: 'get',
    params: {
      gnzbh: gnzbh,
    },
  })
}

//查询我的功能
export function getMyGnxx(param) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/mallGnxx/myGnxx',
    method: 'get',
    params: {
      page: param.pagenum,
      limit: param.pagesize,
    },
  })
}
