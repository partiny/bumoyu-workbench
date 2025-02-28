<template>
  <div class="category-item" v-context-menu="linkEvent.getCategoryContextMenuProps(category.id)">
    <h3 class="category-item-title">{{ category.name }}</h3>
    <draggable
      :key="category.id"
      v-model="list"
      group="group-category"
      class="link-list"
      handle=".link-item"
      ghost-class="ghost"
      chosen-class="chosen"
      item-key="id"
      :animation="400"
      :data-category-id="category.id"
      @start="linkEvent.dragStart"
      @end="linkEvent.dragEnd"
    >
      <template #item="{ element }">
        <link-item
          :item="element"
          :data-link-id="element.id"
          v-context-menu="linkEvent.getLinkContextMenuProps(element, category.id || '')"
          @click="openNewTab(element.url)"
        />
      </template>
      <template v-if="!list.length" #footer>
        <div class="h-100% flex items-center justify-center" :key="`else-${category.id}`">
          <a-empty
            v-if="categoryInfo.requestFinished"
            description="链接空空如也，右键新建一个吧~"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>
<script setup lang="ts">
import type { LinkDto, LinkTreeDto, PropType } from '../../../interface';
import LinkItem from '@/views/page-navigation/components/link-item/index.vue'
import { openNewTab } from '@/utils';
import draggable from 'vuedraggable'
import { useCategory } from '@/views/page-navigation/hooks/category';
import { useLink } from '@/views/page-navigation/hooks/link';

defineProps({
  category: {
    type: Object as PropType<LinkTreeDto>,
    default: () => ({})
  }
})
const { linkEvent } = useLink()
const { category: categoryInfo } = useCategory()
const list = defineModel<LinkDto[]>('list', {
  default: () => []
})

</script>
<style scoped lang="scss">
.category-item {
  background: radial-gradient(49% 49% at 23% 90%,rgba(51,192,253,.3) 0,rgba(51,192,253,0) 100%),radial-gradient(122% 122% at 94% -6%,#dbe2ff 0,#f7f8fc 100%);
  border: 1px solid #e8eaf2;
  border-radius: 16px;
  width: 240px;
  padding: 0 0 16px;
  flex-shrink: 0;
  max-height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  :deep(.ant-empty) {
    width: 100%;
    padding: 0 20px;
    font-size: 12px;
    text-align: center;
    .ant-empty-description {
      white-space: wrap!important;
    }
    .ant-empty-image {
      height: 60px;
      > svg {
        width: 100%;
      }
    }
  }
  &-title {
    color: var(--qt-text-2);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    padding: 16px 16px 12px;
  }
  &.ghost {
    opacity: 0;
  }
}
.link-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 0 16px;
  flex: 1;
  overflow: auto;
  transition: gap .2s;
}
@media screen and (min-width: 780px) and (max-width: 1100px) {
  .category-item {
    width: calc((100% - 48px) / 4);
  }
  .link-list {
    gap: 8px;
  }
}
@media screen and (min-width: 430px) and (max-width: 780px) {
  .category-item {
    width: 160px;
  }
  .link-list {
    gap: 8px;
  }
}
@media screen and (max-width: 430px) {
  .category-item {
    width: 100%;
  }
  .link-list {
    gap: 8px;
  }
}
</style>