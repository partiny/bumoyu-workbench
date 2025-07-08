import { computed } from "vue"

const useBaseInfo = () => {
  // 判断当前页面是否在iframe中
  const isInIframe = computed(() => self !== top)

  return {
    /**判断当前页面是否在iframe中 */
    isInIframe
  }
}

export default useBaseInfo