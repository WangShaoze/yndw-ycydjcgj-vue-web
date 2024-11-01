import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get',
  })
}

// 获取当前登陆人所拥有的菜单
export function getAuthGnxxMenuByLoginUser() {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/getAuthGnxxMenuByLoginUser',
    method: 'get',
  })
}

// 获取当前登陆人自定义的菜单
export function getOwnGnxxByLoginUser() {
  return request({
    url: '/yndw/xtgl/auth/yndw-ycydjcgj-xtgl-auth-service/V1/gnxx/getOwnGnxxByLoginUser',
    method: 'get',
  })
}
