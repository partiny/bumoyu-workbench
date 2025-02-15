import { ref } from "vue";
import type { SuggestionDto } from "./interface";
import { debounce } from "@/utils";
import { getSuggestions, type EngineType } from "./core";

/**关联词列表 */
const suggestionList = ref<SuggestionDto[]>([])
/**当前选中的关联词索引 */
const suggestionIndex = ref<number>(-1)

/**获取关联词列表 */
const getSuggestionList = debounce(async (engine: EngineType, keyword: string) => {
  suggestionList.value = await getSuggestions(engine, keyword)
}, 300)

export const useSuggestion = () => {

  return {
    /**关联词列表 */
    suggestionList,
    /**当前选中的关联词索引 */
    suggestionIndex,
    /**获取关联词列表 */
    getSuggestionList
  }
}