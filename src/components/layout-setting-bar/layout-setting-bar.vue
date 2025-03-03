<template>
  <div class="layout-setting-bar" @click="isDrawerShow = true"></div>
  <a-drawer
    v-model:open="isDrawerShow"
    placement="right"
    :title="null"
    :closable="false"
    :body-style="{
      padding: 0,
      background: 'transparent'
    }"
    :contentWrapperStyle="{
      borderRadius: '12px 0 0 12px',
      overflow: 'hidden',
      background: 'transparent'
    }"
    @close="isDrawerShow = false"
  >
    <div class="setting-container">
      <div class="setting-main">
        <ul class="setting-list">
          <li
            v-for="item in menuList"
            :key="item.id"
            class="setting-item"
            :class="{ 'active': activeMenuId === item.id }"
            @click="activeMenuId = item.id"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="setting-content">
          <component v-if="activeComponent" :is="activeComponent" />
          <a-empty v-else class="mt-100" description="待开发" />
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import SettingTheme from './components/setting-theme.vue'

const isDrawerShow = ref(true)
const menuList = shallowRef([
  { id: 4, name: '主题', component: SettingTheme },
  { id: 1, name: '导航' },
  { id: 2, name: '搜索' },
  { id: 3, name: '菜单' },
  { id: 5, name: '计划' },
  { id: 6, name: '关于' }
])
const activeMenuId = ref(4)

const activeComponent = computed(() => (menuList.value.find(item => item.id === activeMenuId.value)?.component))
</script>
<style scoped lang="scss">
.layout-setting-bar {
  width: 8px;
  height: 100%;
  cursor: pointer;
}
.setting-container {
  background-color: #f6f7fb;
  height: 100%;
  display: flex;
  background-image: linear-gradient(105deg, rgb(97, 92, 237) 7%, rgb(213, 220, 255) 66%);
  padding: 8px;
}
.setting-main {
  background-color: #f8f9fb;
  border-radius: 12px;
  width: 100%;
  display: flex;
}
.setting-list {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 40px 0 0 12px;
  width: 90px;
}
.setting-item {
  transition: all .4s;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  color: var(--qt-text-1);
  padding: 6px 10px;
  &:hover, &.active {
    background-color: #fff;
    color: var(--qt-primary-color);
  }
}
.setting-content {
  border-radius: 0 12px 12px 0;
  background-color: #fff;
  flex: 1;
  padding: 8px;
}
</style>