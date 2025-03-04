<template>
  <div class="pt-20 pb-20 pl-10 pr-10">
    <ul>
      <li>
        <h5 class="font-size-16">模式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="modeValue"
            :options="modeList"
            option-type="button"
            button-style="solid"
            size="small"
            name="mode"
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
const modeList = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '跟随系统' }
]
const modeValue = computed({
  get: () => global.config.theme.mode,
  set: (val: string) => global.updateConfig('theme', {
    ...global.config.theme,
    mode: val
  })
})
</script>