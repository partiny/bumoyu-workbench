<template>
  <a-modal
    v-model:open="visible"
    title="历史备份记录"
    :footer="null"
    @cancel="handleClose"
  >
    <a-space class="mb-12">
      <a-tooltip title="导入本地分类及链接数据（支持 iTab 数据）">
        <a-button class="flex items-center" size="small" @click="handleImport">
          <template #icon>
            <UploadOutlined class="font-size-12" />
          </template>
          <span class="font-size-12">导入本地数据</span>
        </a-button>
      </a-tooltip>
      <a-tooltip title="导出当前分类及链接数据">
        <a-button
          class="flex items-center"
          size="small"
          :loading="downloadLoading"
          @click="handleDownloadCurrent"
        >
          <template #icon>
            <DownloadOutlined class="font-size-12" />
          </template>
          <span class="font-size-12">导出到本地</span>
        </a-button>
      </a-tooltip>
    </a-space>
    <p class="backup-tips">备份记录包含手动备份（用户点击备份按钮）和自动备份（用户对链接分类和链接进行新增、修改、删除操作）的数据。</p> 
    <a-table
      :dataSource="table.list"
      :columns="table.columns"
      size="small"
      :loading="table.loading"
      :pagination="{
        total: pagination.total,
        current: pagination.pageNum,
        pageSize: pagination.pageSize
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" size="small" @click="handleRecover(record.id)">恢复</a-button>
          <a-button type="link" size="small" @click="handleDownload(record)">下载</a-button>
          <a-button type="link" size="small" danger @click="handleDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>
<script setup lang="ts">
import { ApiBackup } from '@/apis';
import { http } from '@/utils';
import { reactive, watch, ref } from 'vue';
import { Modal, message as toast, type PaginationProps } from 'ant-design-vue'
import type { PagingResponse } from '@/utils/http/interface';
import { useCategory } from '../hooks/category';
import dayjs from 'dayjs'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';

interface BackupListDto {
  id?: string;
  createTime?: string;
  typeName?: string;
}
const { categoryEvent } = useCategory()
const visible = defineModel('visible')
const table = reactive({
  loading: false,
  list: [] as BackupListDto[],
  columns: [
    { title: '备份日期', dataIndex: 'createTime' },
    { title: '备份类型', dataIndex: 'typeName' },
    { title: '操作', dataIndex: 'action', width: '150px', align: 'center' }
  ]
})
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
watch(() => visible.value, (val) => {
  if (val) getBackupList()
})

/**刷新列表 */
function handleRefresh() {
  pagination.pageNum = 1
  getBackupList()
}

/**获取备份记录列表 */
function getBackupList() {
  table.loading = true
  http.post<PagingResponse<BackupListDto>>(ApiBackup.getBackupList, {
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  }).then(res => {
    table.loading = false
    const { success, message, data } = res
    if (!success) {
      toast.error(message || `获取备份记录数据错误`)
      return
    }
    table.list = data?.list || []
    pagination.total = data?.total ?? 0
  }).catch(error => {
    table.loading = false
    toast.error(error || `获取备份记录数据错误`)
  })
}
/**分页数据变化事件 */
function handleTableChange({ current, pageSize }: PaginationProps) {
  pagination.pageNum = current ?? 1
  pagination.pageSize = pageSize ?? 10
  getBackupList()
}
/**恢复记录 */
function handleRecover(id: string) {
  Modal.confirm({
    title: '提示',
    content: '此操作将覆盖当前链接数据，是否继续？',
    onOk() {
      table.loading = true
      http.post(ApiBackup.recoverBackup, { id })
        .then(res => {
          table.loading = false
          const { success, message } = res
          if (!success) {
            toast.error(message || `恢复备份记录失败`)
            return
          }
          categoryEvent.getList()
        })
        .catch(error => {
          table.loading = false
          toast.error(error || `恢复备份记录失败`)
        })
    }
  })
}
/**删除记录 */
function handleDelete(id: string) {
  Modal.confirm({
    title: '提示',
    content: '确认删除当前备份记录？',
    onOk() {
      table.loading = true
      http.post(ApiBackup.deleteBackup, { id })
        .then(res => {
          table.loading = false
          const { success, message } = res
          if (!success) {
            toast.error(message || `删除备份记录失败`)
            return
          }
          handleRefresh()
        })
        .catch(error => {
          table.loading = false
          toast.error(error || `删除备份记录失败`)
        })
    }
  })
}
/**下载记录 */
function handleDownload(record: BackupListDto) {
  table.loading = true

  http.download<unknown, Blob>(ApiBackup.exportBackup, { id: record.id })
  .then((res) => {
    table.loading = false
    const url = window.URL.createObjectURL(res as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `备份记录${dayjs(record.createTime).format('YYYY-MM-DD_HH_mm')}.bmy`; // 设置下载文件名
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    table.loading = false
    toast.error(error || `下载备份记录数据错误`)
  })
}
/**关闭弹窗 */
function handleClose() {
  visible.value = false
  table.loading = false
  table.list = []
  pagination.pageNum = 1
  pagination.pageSize = 10
  pagination.total = 0
}
/**导入 */
function handleImport() {
  (document.querySelector('#category-input') as HTMLInputElement)?.click()
}
/**导出 */
const downloadLoading = ref(false)
function handleDownloadCurrent() {
  downloadLoading.value = true

  http.download<unknown, Blob>(ApiBackup.exportCurrentLinkData)
  .then((res) => {
    downloadLoading.value = false
    const url = window.URL.createObjectURL(res as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `备份记录${dayjs().format('YYYY-MM-DD_HH_mm')}.bmy`; // 设置下载文件名
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    downloadLoading.value = false
    toast.error(error || `下载备份记录数据错误`)
  })
}
</script>
<style scoped lang="scss">
.backup-tips {
  color: var(--qt-text-2);
  margin-bottom: 12px;
  font-size: 12px;
}
</style>