<template>
  <div class="search-suggestion">
    <ul v-show="suggestionList.length" class="suggestion-list">
      <li
        v-for="(item, index) in suggestionList"
        :key="item.id"
        class="suggestion-item"
        :class="{ 'active': index === suggestionIndex }"
        @click.stop="handleChoose(item.fullUrl)"
      >{{ item.content }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { openNewTab } from '@/utils';
import { useSuggestion } from '../common';

const { suggestionList, suggestionIndex } = useSuggestion()

const emits = defineEmits(['choose'])
function handleChoose(url: string) {
  openNewTab(url)
  emits('choose')
}
</script>
<style scoped lang="scss">
.search-suggestion {
  margin: 0 10px;
  .suggestion-list {
    border-top: 1px solid #c8cada;
    padding: 8px 0;
    font-size: 13px;
  }
  .suggestion-item {
    padding: 4px;
    border-radius: 4px;
    color: var(--qt-text-1);
    transition: backgroundColor .4s, color .4s;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover, &.active {
      background-color: #f3f2ff;
      color: var(--qt-primary-color);
    }
  }
}
</style>