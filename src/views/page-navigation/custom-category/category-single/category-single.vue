<template>
  <main
    class="wrap"
    v-context-menu="getNavigationContextMenuProps()"
    :style="{
      '--search-area-height': !isInIframe ? '120px' : '20px' 
    }"
  >
    <search-area />
    <div class="content">
      <category-list />
    </div>
    <!-- 新增/编辑链接弹窗 -->
    <link-form @refresh="categoryEvent.getList" />
  </main>
</template>
<script setup lang="ts">
import SearchArea from '../../components/search-area/search-area.vue';
import CategoryList from './category-list.vue';
import LinkForm from '../../components/link-form/link-form.vue';
import { useCategory } from '@/views/page-navigation/hooks/use-category';
import useBaseInfo from '@/stores/base';
import useContextMenu from '../../hooks/use-context-menu';

const { categoryEvent } = useCategory()
const { getNavigationContextMenuProps } = useContextMenu()
const { isInIframe } = useBaseInfo()
</script>
<style scoped lang="scss">
.wrap {
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