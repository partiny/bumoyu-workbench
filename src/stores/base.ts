import { computed } from "vue"

const useBaseInfo = () => {
  // 判断当前页面是否在iframe中
  const isInIframe = computed(() => self !== top && false)

  return {
    /**判断当前页面是否在iframe中 */
    isInIframe
  }
}

export default useBaseInfo