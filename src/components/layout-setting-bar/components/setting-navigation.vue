<template>
  <div class="pt-20 pb-20 pl-10 pr-10">
    <ul>
      <li class="mb-20">
        <h5 class="font-size-16">分类样式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="categoryValue"
            :options="categoryList"
            size="small"
            name="category"
          />
        </div>
      </li>
      <li>
        <h5 class="font-size-16">导航样式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="linkValue"
            :options="linkList"
            size="small"
          />
        </div>
      </li>
    </ul>

  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStore } from '@/stores';

const global = useGlobalStore()

const categoryList = [
  { value: 'single', label: '单页面' },
  { value: 'multiple', label: '多页面' }
]
const categoryValue = computed({
  get: () => global.config.navigation.category,
  set: (val: string) => global.updateConfig('navigation', {
    ...global.config.navigation,
    category: val
  })
})

const linkList = [
  { value: 'card', label: '卡片' },
  { value: 'bar', label: '条状' },
  { value: 'button', label: '纽扣' }
]
const linkValue = computed({
  get: () => global.config.navigation.link,
  set: (val: string) => global.updateConfig('navigation', {
    ...global.config.navigation,
    link: val
  })
})

</script>