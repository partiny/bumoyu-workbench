<template>
  <ul class="color-list">
    <li
      v-for="(item, index) in colors"
      :key="index"
      class="color-item"
      :style="{
        background: item
      }"
      @click="active = item"
    >
      <CheckOutlined v-if="active === item" class="icon-checked" />
    </li>
    <li class="color-item">
      <color-picker
        v-model="currentColor"
        @select="active = currentColor"
        :trigger-style="{
          backgroundImage: `url(${IconColorPicker})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }"
      />
    </li>
  </ul>
  <!-- 颜色选择器弹窗 -->
   
</template>
<script lang="ts" setup>
import { ref, type PropType } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue'
import ColorPicker from '@/views/components/color-picker.vue'
import IconColorPicker from '@/assets/images/icon_color_picker.png'

const currentColor = ref('#fff')

const active = defineModel<string>('active', {
  default: '#fff'
})
defineProps({
  colors: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
</script>
<style lang="scss" scoped>
.color-list {
  display: flex;
  column-gap: 10px;
}
.color-item {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .4s ease;
  .icon-checked {
    font-size: 10px;
    color: #fff;
  }
  > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }
}
</style>