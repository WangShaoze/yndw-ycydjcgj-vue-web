const TokenKey = 'yndw-ycydjcgj-web-dev'  // 定义了一个常量TokenKey，它的值为yndw-ycydjcgj-web-dev。
                                                // 这个键名将用于在浏览器的本地存储（localStorage）中存储和获取与令牌相关的数据，
                                                // 通过这个特定的键名可以准确地定位到存储的相关数据项，以便后续进行读取、更新和删除等操作


/**
 * 定义检查令牌是否存在的函数 checkToken
 * */
export function checkToken() {
  if (localStorage.getItem(TokenKey) != null) {
    return true
  }else{  
    return false
  }
}

/**
 * 定义设置 csrfToken 的函数 putCsrfToken
 * */
export function putCsrfToken(data) {
  if (checkToken()) {  // 如果令牌存在
    let tmpStorage = JSON.parse(localStorage.getItem(TokenKey))
    tmpStorage.csrfToken = data  // 更新 令牌
    return localStorage.setItem(TokenKey, JSON.stringify(tmpStorage))
  } else {
    let tmpStorage = {
      csrfToken: data,
    }
    return localStorage.setItem(TokenKey, JSON.stringify(tmpStorage))
  }
}

/**
* 获取令牌的函数 用户的本地存储数据
* */
export function getStorageToken() {
  return JSON.parse(localStorage.getItem(TokenKey))
}

/**
 * 存储用户登录的令牌数据
 * @param val  "token"
 * @param data  用户token信息
 */
export function putJsonData(val, data) {
  let tmpStorage = JSON.parse(localStorage.getItem(TokenKey))           // localStorage 浏览器的本地存储对象
  tmpStorage[val] = data
  return localStorage.setItem(TokenKey, JSON.stringify(tmpStorage))
}

/**
 * 获取令牌的函数 getToken
 * */
export function getToken() {
  let tmpStorage = JSON.parse(localStorage.getItem(TokenKey))
  if (tmpStorage) {
    if ('token' in tmpStorage) {
      if ('access_token' in tmpStorage.token) {
        return tmpStorage.token['access_token']
      }
    }
    return ''
  }
}

/**
 * 获取 csrfToken 的函数 getCsrfToken
 * */
export function getCsrfToken() {
  let tmpStorage = JSON.parse(localStorage.getItem(TokenKey))
  if (tmpStorage) {
    if ('csrfToken' in tmpStorage) {
      return tmpStorage.csrfToken
    }
    return ''
  }
}

/**
 * 清空本地村粗
 * */
export function delToken() {
  return localStorage.clear()
}
