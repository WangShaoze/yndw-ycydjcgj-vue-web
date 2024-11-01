import request from '@/utils/request'

export const getGwglList = (params) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/list',
    params,
  })
}

export const getGwglListPage = (param) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/page',
    params: {
      zzbh: param.zzbh,
      gwmc: param.gwmc,
      page: param.pagenum,
      limit: param.pagesize,
    },
  })
}

export const changeStatusApi = (data) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/updateZtdm',
    method: 'put',
    data,
  })
}

export const removeGwxx = (data) => {
  return request({
    url: `/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/delete/${data}`,
    method: 'delete',
  })
}
export const saveOrUpdateApi = (data) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gwxx/saveOrUpdate',
    method: 'post',
    data,
  })
}
