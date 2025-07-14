<!-- 浮动气泡 -->
<template>
  <a-popover placement="topRight">
    <a-float-button>
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <template #content>
      <h3 class="fw-600 font-size-14">快捷键说明</h3>
      <ul class="shortcut-key-list">
        <li class="shortcut-key-item">
          <span>导航搜索</span>
          <p>Ctrl + F</p>
        </li>
        <li class="shortcut-key-item">
          <span>侧边栏切换</span>
          <p>Ctrl + ←</p>
        </li>
        <li class="shortcut-key-item">
          <span>设置栏切换</span>
          <p>Ctrl + →</p>
        </li>
      </ul>
    </template>
  </a-popover>
</template>
<script setup lang="ts">
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

</script>
<style scoped lang="scss">
.shortcut-key-list {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  width: 160px;
}
.shortcut-key-item {
  display: flex;
  padding: 10px 0;
  > span {
    display: inline-block;
    width: 100px;
  }
}
</style>