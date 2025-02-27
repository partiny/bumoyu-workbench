<!-- 多组件 - 条状主题 -->
<template>
  <div class="link-item">
    <div class="link-item-icon" :style="{ background: item.backgroundColor }">
      <img v-if="item.src && item.srcShow" :src="item.src" />
      <span v-else>{{ item.iconText?.substring(0, 2) }}</span>
    </div>
    <div class="link-item-content">
      <h5 class="link-item-text">{{ item.name }}</h5>
      <p class="link-item-url">{{ item.url }}</p>
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
  width: 240px;
  user-select: none;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  position: relative;
  transition: borderColor .2s ease;
  margin: 8px;
  &.ghost {
    opacity: 0;
  }
  &:hover {
    border-color: var(--qt-primary-color);
  }
  &-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
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
    font-weight: 600;
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
</style>