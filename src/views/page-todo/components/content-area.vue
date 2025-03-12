<template>
  <section class="content-area">
    <div class="content-inner">
      <div class="mb-12 flex items-center">
        <a-segmented
          class="w-240"
          v-model:value="segmented.current"
          :options="segmented.options"
          block
          @change="(val: string) => segmented.current = val"
        />
        <a-button
          class="ml-auto items-center flex"
          type="primary"
          :icon="h(PlusOutlined)"
          @click="handleFormAdd"
        >新增待办</a-button>
      </div>
      <!-- 日维度展示 -->
      <content-day v-if="segmented.current === 'day'" />
      <!-- 周维度展示 -->
      <content-week v-if="segmented.current === 'week'" />
      <!-- 月维度展示 -->
      <content-month v-if="segmented.current === 'month'" />
    </div>
    <!-- 新增/编辑待办抽屉 -->
    <todo-add-drawer />
  </section>
</template>

<script setup lang="ts">
import { h, reactive, ref } from 'vue';
import ContentDay from './content-day.vue'
import ContentWeek from './content-week.vue'
import ContentMonth from './content-month.vue'
import TodoAddDrawer from './toto-add-drawer.vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import useForm from '../hooks/use-form';

const { handleFormAdd } = useForm()
const segmented = reactive({
  current: 'month',
  options: [
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' }
  ]
});

</script>

<style lang="scss" scoped>
.content-area {
  padding: 16px;
  flex: 1;
  overflow-x: auto;
}
.content-inner {
  min-width: 600px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>