<template>
  <div class="pt-20">
    <ul>
      <li>
        <h5>模式</h5>
        <div class="pt-10">
          <a-radio-group
            v-model:value="theme.mode"
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
import { reactive } from 'vue';

const theme = reactive({
  mode: 'light'
})
const modeList = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '跟随系统' }
]

function handleModeChange(e: Event) {
  console.log(e)
}
</script>