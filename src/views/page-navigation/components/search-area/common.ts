import { ref } from "vue";
import type { SuggestionDto } from "./interface";
import { debounce } from "@/utils";
import { getSuggestions, type EngineType } from "./core";

/**关联词列表 */
const suggestionList = ref<SuggestionDto[]>([])
/**当前选中的关联词索引 */
const suggestionIndex = ref<number>(-1)
/**是否终止请求 */
const isAbort = ref(false)

/**获取关联词列表 */
const getSuggestionList = debounce(async (engine: EngineType, keyword: string) => {
  if (isAbort.value) return
  const result = await getSuggestions(engine, keyword)
  if (!isAbort.value) suggestionList.value = result
}, 300)

export const useSuggestion = () => {

  return {
    /**关联词列表 */
    suggestionList,
    /**当前选中的关联词索引 */
    suggestionIndex,
    /**获取关联词列表 */
    getSuggestionList,
    /**是否终止请求 */
    isAbort
  }
}