<template>
  <div
    class="layout-setting-bar"
    :class="{ fold: isFold }"
    @click="isFold = !isFold"
  >
    <div class="setting-main">
      <ul class="setting-menu-list">
        <li
          v-for="item in menuList"
          :key="item.id"
          class="setting-menu-item"
        >{{ item.name }}</li>
      </ul>
      <div class="setting-content">
        Content
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const isFold = ref(true)
const menuList = ref([
  { id: 1, name: '导航' },
  { id: 2, name: '搜索' },
  { id: 3, name: '侧边栏' },
  { id: 4, name: '主题' },
  { id: 5, name: '计划' },
  { id: 6, name: '关于' }
])
</script>
<style scoped lang="scss">
.layout-setting-bar {
  --layout-setting-bar-width: 400px;
  width: var(--layout-setting-bar-width);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all .8s;
  cursor: pointer;
  z-index: 2;
  &.fold {
    width: 8px;
    opacity: 0;
  }
}
.setting-main {
  border-radius: 12px;
  margin: 8px;
  flex: 1;
  display: flex;
}
.setting-menu-list {
  width: 60px;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}
.setting-menu-item {
  background-color: #fff;
  border-radius: 4px 0 0 4px;
  padding: 4px 8px;
  font-size: 14px;
  color: var(--qt-text-1);
}
.setting-content {
  flex: 1;
  background-color: #fff;
  border-radius: 0 12px 12px;
  padding: 8px;
}
</style>