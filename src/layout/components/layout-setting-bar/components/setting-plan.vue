<template>
  <main class="pt-30 pl-10 pr-10">
    <a-table
      class="plan-table"
      :data-source="table.list"
      :columns="table.columns"
      size="small"
    >
      <template #bodyCell="{ column, text}">
        <template v-if="column.dataIndex === 'status'">
          <a-tag
            :color="['default', 'warning', 'processing', 'success'][text]"
          
            class="plan-tag"
          >
            {{ ['待开始', '进行中', '已完成', '已上线'][text] }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </main>
</template>
<script setup lang="ts">
import { reactive } from 'vue';


const table = reactive({
  list: [
    {
      id: 1,
      feature: '新增全局配置功能',
      status: 3, // 0待开始 1进行中 2已完成 3已上线
      time: '03-05'
    },
    {
      id: 2,
      feature: '优化导航模块架构',
      status: 3, // 0待开始 1进行中 2已完成 3已上线
      time: '03-05'
    },
    {
      id: 3,
      feature: '导航弹窗新增颜色选择器',
      status: 2,
      time: '03-06'
    },
    {
      id: 4,
      feature: '增加版本更新日志',
      status: 2,
      time: '03-06'
    },
    {
      id: 5,
      feature: '网站UI优化',
      status: 0,
      time: '-'
    },
    {
      id: 6,
      feature: '新增登录弹窗',
      status: 0,
      time: '-'
    },
    {
      id: 7,
      feature: '新增多账号切换功能',
      status: 0,
      time: '-'
    },
    {
      id: 8,
      feature: '新增体重记录模块',
      status: 0,
      time: '-'
    }
  ],
  columns: [
    {
      title: '功能',
      dataIndex: 'feature',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40
    },
    {
      title: '上线时间',
      dataIndex: 'time',
      width: 60,
      align: 'right'
    },
  ]
})
</script>
<style scoped lang="scss">
.plan-table {
  :deep(.ant-table-small) {
    font-size: 12px;
  }
  :deep(.ant-table-tbody>tr>td) {
    padding: 6px 4px!important;
  }
  :deep(.ant-table.ant-table-small .ant-table-thead>tr>th) {
    padding: 6px 4px!important;
  }
}
.plan-tag {
  padding-inline: 2px;
  font-size: 10px;
  margin-inline-end: 0;
  line-height: 16px;
  border-radius: 2px;
}
</style>