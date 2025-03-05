<template>
  <div class="pt-20 pb-20 pl-10 pr-10">
    <ul>
      <li class="mb-20">
        <h5 class="font-size-16">当前状态</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="foldValue"
            :options="foldList"
            size="small"
          />
        </div>
      </li>
      <li>
        <h5 class="font-size-16">触发方式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="triggerValue"
            :options="triggerList"
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
const foldList = [
  { value: true, label: '折叠' },
  { value: false, label: '展开' }
]
const foldValue = computed({
  get: () => global.config.sidebar.fold,
  set: (val: boolean) => global.updateConfig('sidebar', {
    ...global.config.sidebar,
    fold: val
  })
})

const triggerList = [
  { value: 'click', label: '点击' },
  { value: 'hover', label: '移入' }
]
const triggerValue = computed({
  get: () => global.config.sidebar.trigger,
  set: (val: string) => global.updateConfig('sidebar', {
    ...global.config.sidebar,
    trigger: val
  })
})

</script>