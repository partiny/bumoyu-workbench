<template>
  <component :is="coms[currentLink]" />
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores';
import LinkCard from './link-card.vue';
import LinkBar from './link-bar.vue';
import LinkButton from './link-button.vue';
import { computed, type Component } from 'vue';

const global = useGlobalStore()
const coms: { [key: string]: Component } = {
  'card': LinkCard,
  'bar': LinkBar,
  'button': LinkButton
}
const currentLink = computed(() => global.config?.navigation?.link || 'card')


</script>