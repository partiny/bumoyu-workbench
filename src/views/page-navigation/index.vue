<template>
  <component :is="coms[currentValue]"></component>
</template>
<script setup lang="ts">
import CategorySingle from './custom-category/category-single/category-single.vue';
import CategoryMultiple from './custom-category/category-multiple/category-multiple.vue';
import { computed, type Component } from 'vue';
import { useGlobalStore } from '@/stores';

const global = useGlobalStore()
const currentValue = computed(() => global.config?.navigation?.category || 'single')
const coms: { [key: string]: Component } = {
  'single': CategorySingle,
  'multiple': CategoryMultiple
}
</script>