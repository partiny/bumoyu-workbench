<template>
  <div class="h-100% p-16 overflow-y-auto" v-context-menu="getNavigationContextMenuProps()">
    <draggable
      v-if="categoryInfo.list.length"
      class="link-category-list"
      tag="ul"
      v-model="categoryInfo.list"
      handle=".category-item"
      ghost-class="ghost"
      chosen-class="chosen"
      item-key="id"
      :animation="400"
      @start="categoryEvent.dragStart"
      @end="categoryEvent.dragEnd"
    >
      <template #item="{ element }">
        <li
          v-context-menu="getCategoryContextMenuProps(element.id)"
          class="category-item"
          :class="{ 'active': activeId === element.id }"
          draggable="true"
          @click="emits('change', element.id)"
        >
          <span>{{ element.name }}</span>
        </li>
      </template>

    </draggable>
    <div v-else class="h-100% flex items-center justify-center"><a-empty description="暂无分类" /></div>
  </div>

  <!-- 新增分类弹窗 -->
  <category-form
    v-model:visible="categoryInfo.form.show"
    :category="categoryInfo.form.current"
    @refresh="categoryEvent.getList"
  />
  <!-- 用input实现文件导入 -->
  <input
    id="category-input"
    :key="Date.now()"
    type="file"
    accept=".itabdata,.bmy"
    @change="(e: Event) => categoryEvent.importFile(e)"
    style="display: none;"
  />
</template>
<script setup lang="ts">
import type { PropType } from '@/views/page-navigation/interface';
import CategoryForm from '@/views/page-navigation/components/category-form/category-form.vue';
import draggable from 'vuedraggable';
import { useCategory } from '@/views/page-navigation/hooks/use-category';
import useContextMenu from '../../hooks/use-context-menu';

defineProps({
  activeId: {
    type: String as PropType<string | null>,
    default: ''
  }
})

const {
  categoryInfo,
  categoryEvent
} = useCategory()
const {
  getNavigationContextMenuProps,
  getCategoryContextMenuProps
} = useContextMenu()

const emits = defineEmits(['change'])
</script>
<style scoped lang="scss">
.category-item {
  border-radius: 12px;
  color: var(--qt-text-1);
  cursor: pointer;
  font-size: 14px;
  height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 36px;
  transition: background .4s ease, color .4s ease;
  padding: 0 16px;
  margin-bottom: 12px;
  user-select: none;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover, &.active {
    background: #f3f2ff;
    color: var(--qt-primary-color);
  }
  &.ghost {
    opacity: 0;
  }
}
</style>
