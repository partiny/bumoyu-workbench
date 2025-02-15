<template>
  <div>
    <a-popover
      v-if="Object.keys(engineInfo).length"
      v-model:open="isVisible"
      trigger="click"
      placement="bottomLeft"
    >
      <template #content>
        <ul class="engine-list">
          <li
            v-for="item in engineList"
            :key="item.code"
            class="engine-item"
            :class="{ active: item.code === theme.searchEngine }"
            @click="handleChoose(item.code as EngineType)"
          >
            <div class="engine-img">
              <img :src="item.icon" />
            </div>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </template>
      <div class="engine-current">
        <img :src="engineInfo.icon" />
        <CaretDownOutlined />
      </div>
    </a-popover>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { engineList, type EngineType } from '../core';
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { useSuggestion } from '../common'
import { useThemeStore } from '@/stores/theme';

const { theme, setSearchEngine } = useThemeStore()
const engineInfo = computed(() => engineList.find(item => item.code === theme.searchEngine) || {})
const isVisible = ref(false) // 控制搜索引擎弹窗显隐
const { suggestionIndex } = useSuggestion()

function handleChoose(code: EngineType) {
  if (code && code !== theme.searchEngine) {
    setSearchEngine(code)
  }
  isVisible.value = false
  suggestionIndex.value = -1
}
</script>
<style scoped lang="scss">
.engine-list {
  width: 300px;
  display: flex;
  flex-wrap: wrap;
}
.engine-item {
  font-size: 12px;
  width: 64px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2px;
  transition: backgroundColor .4s;
  border-radius: 12px;
  cursor: pointer;
  .engine-img {
    width: 36px;
    height: 32px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      width: 20px;
      height: auto;
    }
  }
  > span {
    display: inline-block;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--qt-text-1);
    text-align: center;
  }
  &:hover, &.active {
    background-color: #f3f2ff;
  }
}
.engine-current {
  height: var(--search-input-height);
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  transition: background .4s;
  font-size: 10px;
  color: #b3ada1;
  border-radius: 15px 0 0 15px;
  &:hover {
    background: rgba(246, 247, 251, .8);
  }
  > img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-inline-end: 0;
  }
}
</style>