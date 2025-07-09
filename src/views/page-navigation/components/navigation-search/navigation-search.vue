<!-- 导航搜索组件 -->
<template>
  <a-modal
    v-model:open="visible"
    :footer="null"
    :closable="false"
    :maskClosable="true"
    @cancel="close"
    width="600px"
    class="navigation-search-modal"
  >
    <a-input
      ref="searchInput"
      v-model:value="searchTerm"
      placeholder="搜索导航项..."
      allow-clear
      size="large"
      @change="handleSearch"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>

    <div class="search-results mt-4">
      <a-empty v-if="!results.length" description="未找到匹配的导航项" />
      
      <div v-else class="result-category" v-for="(item, index) in groupedResults" :key="index">
        <div class="category-title">{{ item.name }}</div>
        <div class="category-links">
          <link-card
            v-for="link in item.children"
            class="mb-4px"
            :key="link.id" 
            :item="link"
            :data-link-id="link.id"
            :class="{ 'active-item': flatResults[activeIndex]?.id === link.id }"
            @click="onSelect(link)"
            @mouseenter="handleItemHover(link)"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useCategory } from '../../hooks/category'
import type { LinkDto, LinkTreeDto } from '../../interface'
import LinkCard from '../../custom-link/link-card.vue'
import { openNewTab } from '@/utils'

const {
  category
} = useCategory()
// 当前选中项的索引
const activeIndex = ref(-1)
// 扁平化的搜索结果列表
const flatResults = ref<LinkDto[]>([])
const visible = ref(false)
const searchTerm = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// 搜索结果分组
const groupedResults = computed(() => {
  if (!searchTerm.value) return []
  
  const term = searchTerm.value.toLowerCase()
  const results: LinkTreeDto[] = []
  
  category.list.forEach(item => {
    const matchedLinks = item.children?.filter(link => 
      link.name?.toLowerCase().includes(term) || 
      (link.url && link.url.toLowerCase().includes(term))
    ) || []
    
    if (matchedLinks.length) {
      results.push({
        ...item,
        children: matchedLinks
      })
    }
  })
  
  return results
})

// 扁平化搜索结果（用于空状态判断）
const results = computed(() => {
  return groupedResults.value.flatMap(category => category.children || [])
})

// 新增：监听分组结果变化来更新扁平化列表
watch(groupedResults, (newGroupedResults) => {
  flatResults.value = newGroupedResults.flatMap(category => category.children || [])
  
  // 重置选中项
  if (flatResults.value.length > 0) {
    activeIndex.value = 0
  } else {
    activeIndex.value = -1
  }
}, { immediate: true, deep: true })

// 处理搜索输入
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

// 打开搜索框
const open = () => {
  visible.value = true
  nextTick(() => {
    searchInput.value?.focus()
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown)
  })
}

// 关闭搜索框
const close = () => {
  visible.value = false
  searchTerm.value = ''
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown)
}

// 新增：键盘导航处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (!visible.value) return
  
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      if (activeIndex.value > 0) {
        activeIndex.value--
      } else if (flatResults.value.length > 0) {
        activeIndex.value = flatResults.value.length - 1
      }
      scrollToActiveItem()
      break
      
    case 'ArrowDown':
      event.preventDefault()
      if (activeIndex.value < flatResults.value.length - 1) {
        activeIndex.value++
      } else if (flatResults.value.length > 0) {
        activeIndex.value = 0
      }
      scrollToActiveItem()
      break
      
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < flatResults.value.length) {
        onSelect(flatResults.value[activeIndex.value])
      }
      break
      
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

// 新增：滚动到当前选中项
const scrollToActiveItem = () => {
  nextTick(() => {
    const activeElement = document.querySelector(`[data-link-id="${flatResults.value[activeIndex.value]?.id}"]`)
    if (activeElement) {
      activeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      })
    }
  })
}

// 选择链接
const onSelect = (link: LinkDto) => {
  openNewTab(link.url)
  close()
}

// 处理鼠标悬停时更新选中项
const handleItemHover = (link: LinkDto) => {
  const index = flatResults.value.findIndex(item => item.id === link.id)
  if (index !== -1) {
    activeIndex.value = index
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.navigation-search-modal {
  .ant-modal-body {
    padding: 16px;
  }
  
  .search-results {
    max-height: 60vh;
    overflow-y: auto;
    padding: 8px 0;
    
    .result-category {
      margin-bottom: 16px;
      
      .category-title {
        font-weight: 600;
        margin-bottom: 8px;
        padding-left: 8px;
        border-left: 3px solid #1890ff;
      }
    }
  }
  /* 新增：选中项样式 */
  .active-item {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(24, 144, 255, 0.1);
      border: 1px solid var(--qt-primary-color);
      border-radius: 8px;
      pointer-events: none;
      z-index: 1;
    }
  }
}
</style>