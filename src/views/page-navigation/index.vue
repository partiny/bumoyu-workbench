<template>
  <component :is="coms[theme.navigation]"></component>
</template>
<script setup lang="ts">
// 单页面 - 卡片模式
import ModeSingleCard from './mode-single/index.vue';
// 多页面 - 列表模式
import ModeMultipleList from './mode-multiple/index.vue';
import { useThemeStore } from '@/stores/theme'
import type { Component } from 'vue';

const { theme } = useThemeStore()
const coms: { [key: string]: Component } = {
  'single': ModeSingleCard,
  'multiple': ModeMultipleList
}
</script>