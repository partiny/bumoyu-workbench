<template>
  <div class="pt-20 pb-20 pl-10 pr-10">
    <ul>
      <li>
        <h5 class="font-size-16">搜索引擎</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="engineValue"
            :options="engineList"
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
const engineList = [
  { value: 'bing', label: '必应' },
  { value: 'baidu', label: '百度' }
]
const engineValue = computed({
  get: () => global.config.search.engine,
  set: (val: string) => global.updateConfig('search', {
    ...global.config.search,
    engine: val
  })
})

</script>