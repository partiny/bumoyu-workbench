<template>
  <component :is="coms[link]" />
</template>
<script setup lang="ts">
import MultipleBar from './multiple-bar.vue';
import MultipleRound from './multiple-round.vue';
import SingleCard from './single-card.vue';
import { useThemeStore } from '@/stores/theme';

const { theme: { link } } = useThemeStore()
const coms = {
  'singleCard': SingleCard,
  'multipleBar': MultipleBar,
  'multipleRound': MultipleRound
}

</script>