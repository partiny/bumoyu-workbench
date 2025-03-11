<template>
  <div
    class="menubar"
    :class="{ 'w-0!': fold }"
    :style="{ '--menubar-width': width }"
  >
    <div class="menubar-inner">
      <slot />
    </div>
    <span class="btn-accordion" :class="{ 'fold': fold }" @click="fold = !fold" />
  </div>
</template>
<script setup lang="ts">
const fold = defineModel('fold')
defineProps({
  width: {
    type: String,
    default: '200px'
  }
})

</script>
<style scoped lang="scss">
.menubar {
  width: var(--menubar-width, 200px);
  height: 100%;
  border-right: 1px solid rgba(237,239,245,.45);
  background-color: #fff;
  position: relative;
  transition: width .4s;
  flex-shrink: 0;
  &-inner {
    overflow: hidden;
    width: var(--menubar-width, 200px);
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    word-break: break-all;
  }
}
.btn-accordion {
  display: inline-block;
  width: 22px;
  height: 44px;
  position: absolute;
  right: -22px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
  &::before, &::after {
    width: 4px;
    height: 16px;
    background-color: #c8cad9;
    border-radius: 4px;
    content: '';
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 8px;
    transform: translateX(-50%) rotate(12deg);
    transition: background-color .4s, transform .4s;
  }
  &::after {
    top: auto;
    bottom: 8px;
    transform: translateX(-50%) rotate(-12deg);
  }
  &:hover::before, &:hover::after {
    background-color: #c6c4ff;
  }
  &.fold::before {
    transform: translateX(-50%) rotate(-12deg);
  }
  &.fold::after {
    transform: translateX(-50%) rotate(12deg);
  }
}
</style>