import request from '@/utils/request'

export const getZzglList = (data) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/list',
    data,
  })
}

export const changeStatusApi = (data) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/updateZtdm',
    method: 'put',
    data,
  })
}

export const deleteZzxxApi = (bh) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/delete/' + bh,
    method: 'delete',
  })
}

export const addZzxxApi = (data) => {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/saveOrUpdate',
    method: 'post',
    data,
  })
}
export const getZzxxBybhApi = (bh) => {
  return request({
    url: `/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/zzxx/get/${bh}`,
  })
}
