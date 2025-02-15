<!-- 单组件 - 卡片主题 -->
<template>
  <div class="link-item">
    <div class="link-item-icon" :style="{ background: item.backgroundColor }">
      <img v-if="item.src" :src="item.src" />
      <span v-else>{{ item.iconText?.substring(0, 1) }}</span>
    </div>
    <div class="link-item-content">
      <h5 class="link-item-text">{{ item.name }}</h5>
      <!-- <p class="link-item-url">{{ item.url }}</p> -->
    </div>
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
  font-size: 14px;
  color: var(--qt-text-1);
  background: rgba(255, 255, 255, .5);
  border: 1px solid rgba(255, 255, 255, .5);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  transition: border .2s ease;
  gap: 8px;
  height: 30px;
  padding: 0 8px;
  flex-shrink: 0;
  &.ghost {
    opacity: 0;
  }
  &:hover {
    border: 1px solid var(--qt-primary-color);
  }
  &-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 8px;
    background: linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),conic-gradient(from 190deg at 57% 40%,#8b6ff4 -96deg,#615ced 41deg,#615ced 207deg,#8b6ff4 264deg,#615ced 401deg);
    position: relative;
    > img {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: inherit;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    > span {
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    gap: 4px;
  }
  &-text {
    font-size: 13px;
    color: var(--qt-text-1);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    pointer-events: none;
    width: 100%;
    text-align: left;
    // font-weight: 600;
  }
  &-url {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: var(--qt-text-2);
  }
}
@media screen and (max-width: 1100px) {
  .link-item {
    height: 28px;
  }
  .link-item-text {
    font-size: 12px;
  }
}
</style>