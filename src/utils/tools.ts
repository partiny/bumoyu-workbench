import { message as toast } from "ant-design-vue"

/**常用工具方法集合 */

/**节流 */
export function throttle<T, K=unknown>(
  func: (this: T, ...args: K[]) => void,
  wait: number = 400
) {
  let timeout: number | null = null
  return function(this: T, ...args: K[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}

/**防抖 */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number = 400): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(undefined, args), wait); // 使用 undefined 而不是 this
  };
}

/**在新开页打开url */
export function openNewTab(url?: string) {
  if (!url) {
    toast.info('未获取到链接地址')
    return
  }
  window.open(url)
}