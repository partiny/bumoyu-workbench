<!-- 代码片段 -->
<template>
  <div>
    <pre>
      <code>{{ strHtml }}</code>
    </pre>
  </div>
</template>
<script setup lang="ts">
const strHtml = `
<p>
  函数
  <h3>123</h3>
  <code>selectAll()</code>
  将高亮显示输入字段中的所有文本，以便用户可以复制或删除文本。
</p>
`
</script>