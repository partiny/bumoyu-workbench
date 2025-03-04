<template>
  <div class="pt-20 pb-20 pl-10 pr-10">
    <ul>
      <li class="mb-20">
        <h5 class="font-size-16">默认样式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="autoHideValue"
            :options="autoHideList"
            size="small"
          />
        </div>
      </li>
      <li>
        <h5 class="font-size-16">展开/收起方式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="hideTypeValue"
            :options="hideTypeList"
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
const autoHideList = [
  { value: 'hide', label: '默认隐藏' },
  { value: 'show', label: '默认展开' }
]
const autoHideValue = computed({
  get: () => global.config.menu.autoHide,
  set: (val: string) => global.updateConfig('menu', {
    ...global.config.menu,
    autoHide: val
  })
})

const hideTypeList = [
  { value: 'click', label: '点击' },
  { value: 'hover', label: '移入' }
]
const hideTypeValue = computed({
  get: () => global.config.menu.hideType,
  set: (val: string) => global.updateConfig('menu', {
    ...global.config.menu,
    hideType: val
  })
})

</script>