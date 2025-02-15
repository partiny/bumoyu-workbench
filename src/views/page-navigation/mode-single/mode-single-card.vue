<template>
  <main class="wrap" v-context-menu="category.contextMenu.props">
    <search-area />
    <div class="content">
      <category-list />
    </div>
    <!-- 新增/编辑链接弹窗 -->
    <link-form @refresh="categoryEvent.getList" />
  </main>
</template>
<script setup lang="ts">
import SearchArea from '../components/search-area/search-area.vue';
import CategoryList from './components/category-list/category-list.vue';
import LinkForm from '../components/link-form/link-form.vue';
import { useCategory } from '@/views/page-navigation/hooks/category';

const {
  category,
  categoryEvent
} = useCategory()
</script>
<style scoped lang="scss">
.wrap {
  --search-area-height: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: var(--search-area-height) 36px 20px;
}
.content {
  flex: 1;
  width: 100%;
  overflow: auto;
}
</style>