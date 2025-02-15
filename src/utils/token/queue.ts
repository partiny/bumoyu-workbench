import type { InternalAxiosRequestConfig } from "axios"

let isRefreshing = false
let queueList: (() => void)[] = [] // 待请求的队列
let options: { [key: symbol]: InternalAxiosRequestConfig } = {}

function startRefresh() {
  isRefreshing = true
}

function stopRefresh() {
  isRefreshing = false
}

function isTokenRefreshing() {
  return isRefreshing
}

function add(cb: () => void) {
  queueList.push(cb)
}

function execution() {
  while(queueList.length) {
    const cb = queueList.shift()
    cb && cb()
  }
}

function clear() {
  isRefreshing = false
  queueList = []
  options = {}
}

function setOptions(key: symbol, value: InternalAxiosRequestConfig) {
  options[key] = value
}

function getOptions(key: symbol) {
  return options[key]
}

function removeOptions(key: symbol) {
  return options[key]
}

export default {
  startRefresh,
  stopRefresh,
  isTokenRefreshing,
  add,
  execution,
  clear,
  setOptions,
  getOptions,
  removeOptions,
  queueList
}