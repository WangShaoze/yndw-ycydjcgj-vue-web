import request from '@/utils/request'

// 搜索应用
export function searchYy(wordkey) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchYy',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      searchWord: wordkey,
      limit: 8,
    },
  })
}

// 搜索功能
export function searchGn(wordkey) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchGn',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      searchWord: wordkey,
      limit: 8,
    },
  })
}
// 搜索API
export function searchApi(wordkey) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchApi',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      searchWord: wordkey,
      limit: 8,
    },
  })
}
// 搜索组件
export function searchZj(wordkey) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchZj',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      searchWord: wordkey,
      limit: 8,
    },
  })
}

// 搜索数据资源
export function searchSjzy(wordkey) {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchSjzy',
    headers: {
      isToken: false,
    },
    method: 'get',
    params: {
      searchWord: wordkey,
      limit: 8,
    },
  })
}

// 搜索数据资源
export function hotWord() {
  return request({
    url: '/yndw/mall/components/yndw-ycydjcgj-mall-components/V1/ignore/searchHotWord',
    headers: {
      isToken: false,
    },
    method: 'get',
  })
}
