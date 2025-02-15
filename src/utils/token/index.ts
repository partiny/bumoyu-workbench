import { ApiAuth } from '@/apis';
import Queue from './queue'
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getRefreshToken, getToken, removeToken, setRefreshToken, setToken } from '../auth';
import router from '@/router';
import type { RefreshTokenResult, HttpResponse } from '../http/interface';

const STATUS_CODE = {
  EXPIRDE: 4001, // token过期，刷新token
  ILLEGAL: 4002, // token不合法，缺少必要的参数，重新登录
  MISS: 4003, // token缺失，重新登录
  UNAUTHORIZED: 401 // 未授权，刷新token
}

// 请求时的处理器
// 正在请求刷新token接口时，就将当前请求存到队列中，刷新完token后，将队列中的请求依次执行
function requestHandler(
  whiteList: string[], // 域名白名单
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  return new Promise(resolve => {
    const { url } = config
    if (url && whiteList.includes(url)) {
      resolve(config)
      return
    }
    const accessToken = getToken()
    if (Queue.isTokenRefreshing() && config && url && !whiteList.includes(url)) {
      Queue.add(() => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        resolve(config)
      })
      return
    }

    if (accessToken && !whiteList.includes(url || '-9999')) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return resolve(config)
  })
}

// 响应时的处理器
function responseHandler(
  response: AxiosResponse,
  whiteList: string[],
  instance: AxiosInstance,
): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    const { config: { url }, data: { code, message }, status } = response
    
    // 若当前url处于白名单中，则不处理，直接返回Promise<response.data>
    if (whiteList.includes(url || '-9999')) {
      resolve(response.data)
      return
    }

    // 若状态码或返回的code值不为刷新token的值，则直接返回Promise<response.data>
    if (!Object.values(STATUS_CODE).includes(code) && !Object.values(STATUS_CODE).includes(status)) {
      resolve(response.data)
      return
    }
    // 若状态码非法码，则清空缓存，则进行非法处理，如跳转登录页；
    if ([STATUS_CODE.ILLEGAL, STATUS_CODE.MISS].includes(code)) {
      reject(message || '状态码不合法')
      clear()
      return
    }

    // 若状态码为刷新码，则刷新token
    // 若当前token未在刷新中，则请求刷新token接口
    const unique = Symbol()
    if (!response.config.headers) {
      response.config.headers = {} as AxiosRequestHeaders
    }
    response.config.headers['request_unique'] = unique
    Queue.add(() => {
      resolve(instance(response.config))
    })

    if (!Queue.isTokenRefreshing()) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        reject('当前用户未登录')
        console.error('未获取到刷新token')
        clear()
        return
      }
      instance.post<RefreshTokenResult, HttpResponse<RefreshTokenResult>>(ApiAuth.refreshToken, {
        refreshToken: refreshToken
      }).then(res => {
        const { success, message, data } = res || {}
        if (!success) {
          // 清空缓存，清空队列，跳转登录
          reject(message || '刷新token接口错误1')
          clear()
          return
        }
        Queue.stopRefresh()

        const { accessToken, refreshToken } = data || {}
        accessToken && setToken(accessToken)
        refreshToken && setRefreshToken(refreshToken)
        // 执行队列
        Queue.execution()
      }).catch(error => {
        Queue.stopRefresh()
        // 清空缓存，清空队列，跳转登录
        reject(error || '刷新token接口错误2')
        clear()
      })
      return
    }
    
    resolve(response.data)
  })
}

function clear() {
  Queue.stopRefresh()
  Queue.clear()
  removeToken()
  router.replace('/login')
}

export default {
  requestHandler,
  responseHandler
}
