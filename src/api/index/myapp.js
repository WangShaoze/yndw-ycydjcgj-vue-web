import request from '@/utils/request'
// 获取我的应用
export function myapp(paramFrom, ywy) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/yyxx/myapp',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      page: paramFrom.currentPage,
      limit: paramFrom.pagesize,
      ywybh: ywy,
    },
  })
}

export function getyys(yylb) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/yyxx/getyys',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      yylb: yylb,
    },
  })
}

export function recommendApp() {
  return request({
    headers: {
      isToken: false,
    },
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/yyxx/recommendApp',
    method: 'put',
  })
}
