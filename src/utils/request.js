/**
 * 把 axios 相关操作封装到此模块中
 * 需要发请求的地方去加载使用
 */

import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

// 后台返回的数值过大超出安全范围无法精确表示 转换为对象
request.defaults.transformResponse = [(data) => {
  try {
    return JSONBig.parse(data)
  } catch (e) {
    return data
  }
}]
export default request
