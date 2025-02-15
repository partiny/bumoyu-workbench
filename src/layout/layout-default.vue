<template>
  <main class="layout-container">
    <layout-sidebar />
    <div class="layout-content">
      <div class="layout-content-main">
        <router-view />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import LayoutSidebar from '@/components/layout-sidebar.vue'
</script>
<style scoped lang="scss">
.layout-container {
  display: flex;
  background-image: linear-gradient(105deg, rgb(97, 92, 237) 7%, rgb(213, 220, 255) 66%);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left center;
  height: 100%;
}

.layout-content {
  height: 100%;
  padding: 8px 8px 8px 0;
  width: 100vw;
  overflow-x: auto;
  &-main {
    border-radius: 12px;
    background-color: #f6f7fb;
    height: 100%;
    overflow-y: hidden;
  }
}
</style>