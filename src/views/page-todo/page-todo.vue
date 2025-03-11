<template>
  <main class="flex h-100%">
    <layout-menubar v-model:fold="fold" width="300px">
      <brief-area />
    </layout-menubar>
    <content-area />
  </main>
</template>
<script setup lang="ts">
import LayoutMenubar from '@/layout/components/layout-menubar.vue';
import BriefArea from './components/brief-area.vue';
import ContentArea from './components/content-area.vue';
import { ref } from 'vue';

const fold = ref(false);
</script>
<style scoped lang="scss">

</style>