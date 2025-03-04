<template>
  <div class="h-100%">
    <template v-if="category.requestFinished">
      <draggable
        v-if="category.list.length"
        class="category-list"
        tag="div"
        v-model="category.list"
        handle=".category-item"
        ghost-class="ghost"
        chosen-class="chosen"
        item-key="id"
        :animation="400"
        @start="categoryEvent.dragStart"
        @end="categoryEvent.dragEnd"
      >
        <template #item="{ element }">
          <category-item
            :category="element"
            v-model:list="element.children"
          />
        </template>
      </draggable>
      <div v-if="!category.list.length" class="pt-80">
        <a-empty description="还没有分类，右键新建一个吧~" />
      </div>
    </template>
    <!-- 骨架屏 -->
    <div v-else class="category-list">
      <category-skeleton v-for="i in [15, 3, 10, 6]" :rows="i" :key="i" />
    </div>
  </div>
  <!-- 新增分类弹窗 -->
  <category-form
    v-model:visible="category.form.show"
    :category="category.form.current"
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
import { onBeforeMount } from 'vue';
import CategoryItem from './category-item.vue'
import draggable from 'vuedraggable'
import { useCategory } from '@/views/page-navigation/hooks/category';
import CategoryForm from '@/views/page-navigation/components/category-form/category-form.vue';
import CategorySkeleton from './category-skeleton.vue';

const {
  category,
  categoryEvent
} = useCategory()

onBeforeMount(() => {
  categoryEvent.getList()
})

</script>
<style scoped lang="scss">
.category-list {
  height: 100%;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0 auto;
  &::after {
    content: ' ';
    flex: auto;
  }
}
</style>