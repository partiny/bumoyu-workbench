<template>
  <ul class="color-list">
    <li
      v-for="(item, index) in colorList"
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
import { ref } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue'
import ColorPicker from '@/views/components/color-picker/index.vue'
import IconColorPicker from '@/assets/images/icon_color_picker.png'

const colorList = [
  'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),conic-gradient(from 190deg at 57% 40%,#8b6ff4 -96deg,#615ced 41deg,#615ced 207deg,#8b6ff4 264deg,#615ced 401deg)',
  '#1681ff', '#fbbe23', '#fc4548', '#4b3c36', '#7dac88', '#023373', '#c8ac70', '#372128', '#c82c34', '#054092', '#a3ddb9'
]

const currentColor = ref('#fff')

const active = defineModel<string>('active')


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
  // &:hover {
  //   transform: scale(1.2);
  // }
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