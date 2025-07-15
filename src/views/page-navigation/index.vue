<template>
  <component :is="coms[currentValue]"></component>
  <!-- 导航搜索组件 -->
  <navigation-search ref="navigationSearchRef" />
  <!-- 导航页浮动气泡 -->
  <floating-bubble />
</template>
<script setup lang="ts">
import CategorySingle from './custom-category/category-single/category-single.vue';
import CategoryMultiple from './custom-category/category-multiple/category-multiple.vue';
import { computed, defineComponent, onMounted, onUnmounted, ref, type Component } from 'vue';
import { useGlobalStore } from '@/stores';
import NavigationSearch from './components/navigation-search/navigation-search.vue';
import FloatingBubble from './components/floating-bubble.vue';

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
function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey) {
    switch(event.key.toLowerCase()) {
      // ctrl + f：导航搜索
      case 'f':
        event.preventDefault()
        navigationSearchRef.value?.open()
        break;
      // ctrl + 左箭头 切换左侧边栏显隐
      case 'arrowleft':
        event.preventDefault()
        global.updateConfig('sidebar', {
          ...global.config.sidebar,
          fold: !global.config.sidebar.fold 
        })
        break;
      // ctrl + 右箭头 切换右侧边栏显隐
      case 'arrowright':
        event.preventDefault()
        global.updateConfig('settingsBar', {
          ...global.config.settingsBar,
          fold: !global.config.settingsBar.fold 
        })
        break;
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown, true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown, true)
})
</script>