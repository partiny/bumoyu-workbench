<template>
  <a-modal
    v-model:open="visible"
    title="设置"
    :footer="null"
    @cancel="handleClose"
  >
    <div class="min-h-300">
      <div class="mb-16">
        <h3 class="mb-8 fw-600">主题切换</h3>
        <a-radio-group
          v-model:value="currentTheme"
          :options="themeOptions"
          @change="handleChangeTheme"
        />
      </div>
      <div>
        <h3 class="mb-8 fw-600">链接备份</h3>
        <a-space>
          <a-button class="flex items-center" size="small" @click="handleImport">
            <template #icon>
              <UploadOutlined class="font-size-12" />
            </template>
            <span class="font-size-12">导入本地数据</span>
          </a-button>
          <a-button
            class="flex items-center"
            size="small"
            :loading="downloadLoading"
            @click="handleDownload"
          >
            <template #icon>
              <DownloadOutlined class="font-size-12" />
            </template>
            <span class="font-size-12">导出到本地</span>
          </a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ApiBackup } from '@/apis';
import { http } from '@/utils';
import { computed, ref } from 'vue';
import { message as toast } from 'ant-design-vue'
import dayjs from 'dayjs'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { useThemeStore, navigationTheme } from '@/stores/theme';

const { setTheme, theme } = useThemeStore()
const visible = defineModel('visible')
const currentTheme = ref(theme.navigation)
const themeOptions = computed(() => {
  const options = []
  for(let key in navigationTheme) {
    options.push({
      label: navigationTheme[key],
      value: key
    })
  }
  return options
})

/**切换主题 */
function handleChangeTheme() {
  setTheme(currentTheme.value)
}
/**关闭弹窗 */
function handleClose() {
  visible.value = false
}
/**导入 */
function handleImport() {
  (document.querySelector('#category-input') as HTMLInputElement)?.click()
}
/**导出 */
const downloadLoading = ref(false)
function handleDownload() {
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