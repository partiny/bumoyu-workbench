<template>
  <div class="search-input">
    <input
      ref="inputRef"
      :value="searchVal"
      type="text"
      placeholder="输入要搜索的内容"
      @input="onInput"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @blur="onBlur"
      @focus="onFocus"
      @contextmenu="e => e.preventDefault()"
    >
    <div v-show="searchVal.length" class="search-input-close" @click="onClear">
      <CloseOutlined />
    </div>
    <div class="search-input-btn" @click="onSearch">
      <SearchOutlined />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { getFullUrl, getSuggestions } from '../core';
import { message as toast } from 'ant-design-vue';
import { useSuggestion } from '../common';
import { useGlobalStore } from '@/stores';

const global = useGlobalStore()

const { suggestionList, suggestionIndex, getSuggestionList } = useSuggestion()
/**当前选择的搜索引擎编码 */
const searchVal = ref('')
const inputRef = ref()
const currentEngine = computed(() => global.config?.search?.engine || 'bing')

function onInput (e: Event) {
  const v = (e.target as HTMLInputElement)?.value.trim()
  searchVal.value = v
  getSuggestionList(currentEngine.value, searchVal.value)
}

function onClear() {
  searchVal.value = ''
  suggestionList.value = []
}
/**监听输入框键盘事件 */
let interval: number
const isKeydown = ref(false)
function onKeyup(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      onSearch()
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      clearInterval(interval)
      isKeydown.value = false
      break;
  }
}
function onKeydown(e: KeyboardEvent) {
  if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return
  // keydown按住的时候会一直触发，所以需要加个开关控制一下
  if (isKeydown.value) return
  isKeydown.value = true
  handleMove(e.key)
  interval = setInterval(() => handleMove(e.key), 200)
}

function onSearch() {
  const fullUrl = getFullUrl(currentEngine.value, searchVal.value)
  if (fullUrl) {
    window.open(fullUrl)
    onClear()
    inputRef.value.blur()
  } else {
    toast.info('先选择一个搜索引擎吧！')
  }
}

function onBlur() {
  // input 的 blur 事件优先级比关联词的 click 事件高
  // 所以此处加一个延迟处理，解决点击关联词时无效的问题
  const timer = setTimeout(() => {
    clearTimeout(timer)
    suggestionList.value = []
  }, 100)
}
async function onFocus() {
  if (!searchVal.value) return
  suggestionList.value = await getSuggestions(currentEngine.value, searchVal.value)
}

/**关联词向上或向下移动 */
function handleMove(key: string) {
  if (!['ArrowUp', 'ArrowDown'].includes(key)) return
  if (key === 'ArrowUp') {
    handleSelectItem(suggestionIndex.value - 1)
  } else if (key === 'ArrowDown') {
    handleSelectItem(suggestionIndex.value + 1)
  }
}

/**移动后关联词索引的处理 */
function handleSelectItem(index: number) {
  const length = suggestionList.value.length
  if (!length) return
  if (index > length - 1) {
    suggestionIndex.value = 0
  } else if (index < 0) {
    suggestionIndex.value = length - 1
  } else {
    suggestionIndex.value = index
  }
  searchVal.value = suggestionList.value[suggestionIndex.value].content
}

defineExpose({
  clear: onClear
})

</script>
<style scoped lang="scss">
.search-input {
  height: var(--search-input-height);
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  input {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    color: var(--qt-text-1);
  }
  &-close {
    color: #999;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 4px;
    cursor: pointer;
  }
  &-btn {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 8px;
    cursor: pointer;
    transition: background .4s;
    font-size: 10px;
    color: #b3ada1;
    font-size: 16px;
    color: #999;
    padding: 0 12px;
    border-radius: 0 15px 15px 0;
    &:hover {
      background: rgba(246, 247, 251, .8);
    }
    > img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      margin-inline-end: 0;
    }
  }
}

</style>