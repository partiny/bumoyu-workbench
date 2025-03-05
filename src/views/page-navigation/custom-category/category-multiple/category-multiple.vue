<!-- 链接样式 - 多页面 -->
<template>
  <section class="flex h-100%">
    <layout-menubar>
      <category-list
        :active-id="activeId"
        @change="handleCategoryChange"
      />
    </layout-menubar>
    <div class="content-wrap">
      <search-area />
      <category-item
        v-model:list="linkList"
        :category-id="activeId"
        @refresh="handleRefresh"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue';
import LayoutMenubar from '@/layout/components/layout-menubar.vue';
import CategoryList from './category-list.vue';
import CategoryItem from './category-item.vue';
import type { LinkDto, LinkTreeDto } from '../../interface';
import { throttle } from '@/utils';
import SearchArea from '../../components/search-area/search-area.vue';
import { useCategory } from '@/views/page-navigation/hooks/category';

const {
  category,
  categoryEvent
} = useCategory()
const activeId = ref('') // 当前选中的分类id
const categoryList = ref<LinkTreeDto[]>([]) // 分类列表
const linkList = ref<LinkDto[]>([]) // 链接列表

/**鼠标滚轮事件 */
const handleMouseWheel = throttle((e: Event) => {
  const length = category.list.length
  if (!length) return
  let index = category.list.findIndex(item => item.id === activeId.value)
  const y = (e as WheelEvent).deltaY
  if (y > 0) {
    index = index + 1 >= length ? 0 : index + 1
  } else if (y < 0) {
    index = index -1 < 0 ? length - 1 : index - 1
  }
  handleCategoryChange(category.list[index]?.id || '')
}, 400)

/**切换分类 */
function handleCategoryChange(id: string) {
  activeId.value = id
  getLinkList()
}
/**获取链接列表 */
function getLinkList() {
  linkList.value = category.list.find(item => item.id === activeId.value)?.children || []
}

function handleRefresh() {
  categoryEvent.getList().then(() => {
    if (!activeId.value || !category.list.some(item => item.id === activeId.value)) {
      activeId.value = category.list[0]?.id || ''
    }
    getLinkList()
  })
}

onBeforeMount(() => {
  handleRefresh()
})
const domContent = ref()
onMounted(() => {
  domContent.value = document.querySelector('.content-wrap')
  domContent.value?.addEventListener('mousewheel', handleMouseWheel, { passive: true })
})
onUnmounted(() => {
  domContent.value?.removeEventListener('mousewheel', handleMouseWheel, { passive: true })
})
</script>
<style scoped lang="scss">
.content-wrap {
  --search-area-height: 100px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  padding-top: var(--search-area-height);
  position: relative;
  overflow: auto;
}
</style>