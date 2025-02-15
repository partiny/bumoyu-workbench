<template>
  <div class="search-area">
    <div class="search-main">
      <div class="search-inner">
        <search-prefix />
        <search-input ref="searchInputRef" />
      </div>
      <search-suggestion @choose="searchInputRef?.clear()" />
    </div>
    
  </div>
</template>
<script setup lang="ts">
import SearchPrefix from './components/search-prefix.vue'
import SearchInput from './components/search-input.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { ref } from 'vue';

const searchInputRef = ref()
</script>
<style scoped lang="scss">
.search-area {
  height: var(--search-area-height);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f6f7fb;
  background: linear-gradient(to bottom, rgba(246, 247, 251, 1) 0%, rgba(246, 247, 251, 1) 70%, rgba(246, 247, 251, 0) 100%);
  z-index: 1;
}
.search-main {
  --search-input-height: 50px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  width: calc(100% - 120px);
  max-width: 900px;
  min-width: 240px;
  border-radius: 16px;
  border: 1px solid #e8eaf2;
  transition: border-color .4s;
  padding: 0;
  background: #fff;
  box-shadow: 0 12px 24px -16px rgba(54,54,73,.04);
  z-index: 1;
  &:hover, &:focus, &:has(input:focus) {
    border-color: var(--qt-primary-color);
  }
}
.search-inner {
  display: flex;
  align-items: flex-start;
  border-radius: inherit;
}
</style>