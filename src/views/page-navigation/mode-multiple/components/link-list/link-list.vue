<template>
  <div class="flex-1 overflow-auto w-100%" v-context-menu="contextMenuProps">
    <Transition>
      <draggable
        v-if="list.length && categoryId"
        :key="categoryId"
        v-model="list"
        class="link-list"
        handle=".link-item"
        ghost-class="ghost"
        chosen-class="chosen"
        item-key="id"
        :animation="400"
        :data-category-id="categoryId"
        @start="linkEvent.dragStart"
        @end="e => linkEvent.dragEnd(e, list)"
      >
        <template #item="{ element }">
          <link-item
            :item="element"
            :data-link-id="element.id"
            v-context-menu="linkEvent.getLinkContextMenuProps(element, categoryId)"
            @click="openNewTab(element.url)"
          />
        </template>
      </draggable>
      
      <div v-else class="h-100% flex items-center justify-center" :key="`else-${categoryId}`">
        <a-empty v-if="category.requestFinished" description="链接空空如也，右键新建一个吧~" />
      </div>
    </Transition>
    <link-form @refresh="emits('refresh')"
    />
  </div>
</template>
<script setup lang="ts">
import type { ContextMenuProps } from '@/directives/context-menu/interface';
import type { LinkDto, PropType } from '@/views/page-navigation/interface';
import LinkItem from '@/views/page-navigation/components/link-item/index.vue'
import LinkForm from '@/views/page-navigation/components/link-form/link-form.vue';
import { openNewTab } from '@/utils';
import draggable from 'vuedraggable'
import { useCategory } from '@/views/page-navigation/hooks/category';
import { useLink } from '@/views/page-navigation/hooks/link';

const props = defineProps({
  categoryId: {
    type: String as PropType<string | null>,
    default: ''
  }
})
const { category } = useCategory()
const { linkEvent } = useLink()
const list = defineModel<LinkDto[]>('list', {
  default: () => []
})
const emits = defineEmits(['refresh'])

const contextMenuProps: ContextMenuProps = {
  options: [
    { name: '添加链接', code: 'link-add' }
  ],
  onChoose(item) {
    switch(item.code) {
      case 'link-add':
        linkEvent.add(props.categoryId || '')
        break
    }
  }
}
</script>
<style scoped lang="scss">
.link-list {
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
  min-width: 1000px;
}
.v-enter-from {
  transform: translateY(-100vh);
}
.v-enter-to {
  transition: .4s;
  transform: translateY(0);
}
</style>