<!-- 多组件 - 纽扣主题 -->
<template>
  <div class="link-item">
    <div class="link-item-icon" :style="{ background: item.backgroundColor }">
      <img v-if="item.src" :src="item.src" />
      <span v-else>{{ item.iconText }}</span>
    </div>
    <p class="link-item-text">{{ item.name }}</p>
  </div>
</template>
<script setup lang="ts">
import type { PropType, LinkDto } from '@/views/page-navigation/interface';

defineProps({
  item: {
    type: Object as PropType<LinkDto>,
    default: () => ({})
  }
})
</script>
<style scoped lang="scss">
.link-item {
  width: 72px;
  user-select: none;
  border-radius: 15px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 18px 18px 0;
  &.ghost {
    opacity: 0;
  }
  &-icon {
    width: 56px;
    height: 56px;
    border-radius: 15px;
    line-height: 56px;
    text-align: center;
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
    background: linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),conic-gradient(from 190deg at 57% 40%,#8b6ff4 -96deg,#615ced 41deg,#615ced 207deg,#8b6ff4 264deg,#615ced 401deg);
    transition: box-shadow .4s;
    cursor: pointer;
    margin-bottom: 6px;
    position: relative;
    &:hover {
      box-shadow: 0 2px 20px #8b8dae26;
    }
    > img {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 15px;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
  &-text {
    font-size: 12px;
    color: var(--qt-text-1);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    pointer-events: none;
  }
}
</style>