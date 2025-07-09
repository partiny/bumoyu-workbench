<template>
  <component :is="coms[currentValue]"></component>
  <!-- 导航搜索组件 -->
  <navigation-search ref="navigationSearchRef" />
</template>
<script setup lang="ts">
import CategorySingle from './custom-category/category-single/category-single.vue';
import CategoryMultiple from './custom-category/category-multiple/category-multiple.vue';
import { computed, defineComponent, onMounted, onUnmounted, ref, type Component } from 'vue';
import { useGlobalStore } from '@/stores';
import NavigationSearch from './components/navigation-search/navigation-search.vue';

defineComponent({
  name: 'PageNavigation'
})

const global = useGlobalStore()
const currentValue = computed(() => global.config?.navigation?.category || 'single')
const coms: { [key: string]: Component } = {
  'single': CategorySingle,
  'multiple': CategoryMultiple
}

const navigationSearchRef = ref()
// 添加快捷键监听
let lastKeyPressTime = 0
const doublePressThreshold = 300 // 300ms内两次按键视为双击

function handleKeyDown(event: KeyboardEvent) {
  // 处理双击Ctrl逻辑
  if (event.key === 'Control') {
    const now = Date.now()
    if (now - lastKeyPressTime < doublePressThreshold) {
      event.preventDefault()
      navigationSearchRef.value?.open()
    }
    lastKeyPressTime = now
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>