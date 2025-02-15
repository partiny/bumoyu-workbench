<template>
  <a-config-provider
    :locale="zhCN"
    :theme="themeConfig"
  >
    <router-view />
  </a-config-provider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const themeConfig = {
  token: {
    colorPrimary: '#615ced',
    colorLink: '#615ced',
    colorInfoHover: '#9189fa'
  }
}
</script>