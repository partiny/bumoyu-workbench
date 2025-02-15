import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import router from '@/router';
import { ApiAuth } from '@/apis';
import qtToken from '../token/index';
import type { HttpResponse, AnyObject } from './interface';

// 创建实例时配置默认值
const instance: AxiosInstance = axios.create({
  timeout: 30000, // 请求超时时间设置为 30s
  timeoutErrorMessage: '请求超时'
})

// 接口白名单
const WHITE_LIST = [
  ApiAuth.refreshToken,
  ApiAuth.signIn
]
// 添加请求拦截器
instance.interceptors.request.use(
  function(config: InternalAxiosRequestConfig) {
    // 发送请求之前的处理
    if (window.navigator.onLine) {
      localStorage.setItem('NETWORK_ONLINE', 'true')
    }

    return qtToken.requestHandler(WHITE_LIST, config)
  },
  function(error: AxiosError) {
    // 对请求错误的处理
    return Promise.reject('request: ' + error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function(response: AxiosResponse) {
    // 2xx 范围内的状态码都会触发该函数。
    return qtToken.responseHandler(response, WHITE_LIST, instance);
  },
  async function(error: AxiosError<HttpResponse>) {
    if (!window.navigator.onLine) {
      localStorage.setItem('NETWORK_ONLINE', 'false')
      router.push('/offline')
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { response } = error
    if (!response) return Promise.reject(error)
    return qtToken.responseHandler(response, WHITE_LIST, instance)
  }
)

type Response<T, K = HttpResponse<T>> = Promise<HttpResponse<T> | K>
const http = {
  get<T>(url: string, data: AnyObject = {}, config: AxiosRequestConfig = {}): Response<T> {
    // 路由参数中添加时间戳防止浏览器缓存页面
    const params = convertObjectToRouteParam(
      Object.assign(data || {}, { _t: new Date().getTime() })
    )
    url += `${url.indexOf('?') > -1 ? '&' : '?'}` + params
    return instance.get(url, config)
  },
  post<T>(url: string, data: AnyObject = {}, config: AxiosRequestConfig = {}): Response<T> {
    return instance.post(url, data, config)
  },
  postForm<T>(url: string, data: AnyObject = {}, config: AxiosRequestConfig = {}): Response<T> {
    config.headers = config.headers || {}
    config.headers['Content-type'] = `application/x-www-form-urlencoded; charset=UTF-8`
    return instance.post(url, data ? JSON.stringify(data) : null, config)
  },
  postFile<T>(url: string, data: AnyObject = {}, config: AxiosRequestConfig = {}): Response<T> {
    config.headers = config.headers || {}
    config.headers['Content-type'] = `multipart/form-data`
    return instance.post(url, data, config)
  },
  download<T, K = undefined>(url: string, data: AnyObject = {}, config: AxiosRequestConfig = {}): Response<T, K> {
    config.responseType = 'blob'
    return instance.post(url, data, config) as Promise<HttpResponse<T>>
  }
}

// 将对象转为路由参数字符串
function convertObjectToRouteParam(obj: AnyObject) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('当前参数不是对象类型')
  }
  const arr: string[] = []
  Object.keys(obj).forEach(key => {
    arr.push(`${key}=${obj[key]}`)
  })
  return arr.join('&')
}

export default http