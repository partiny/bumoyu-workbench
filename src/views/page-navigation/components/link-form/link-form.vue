<template>
  <a-modal
    v-model:open="linkInfo.form.show"
    :title="`${isEdit ? '编辑':'新增'}导航`"
    cancel-text="取消"
    ok-text="确认"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <a-form
      :model="form"
      :label-col="{
        span: 4
      }"
      label-align="left"
    >
      <a-form-item label="名称">
        <a-input
          v-model:value="form.name"
          placeholder="请输入"
          allow-clear
          :maxlength="20"
          show-count
        />
      </a-form-item>
      <a-form-item label="地址">
        <a-input v-model:value="form.url" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="图标颜色">
        <ul class="color-list">
          <li
            v-for="(item, index) in colorList"
            :key="index"
            class="color-item"
            :style="{
              background: item
            }"
            @click="form.backgroundColor = item"
          >
            <CheckOutlined v-if="form.backgroundColor === item" class="icon-checked" />
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="图标文字">
        <a-input
          v-model:value="form.iconText"
          placeholder="请输入"
          allow-clear
          :maxlength="6"
          show-count
        />
      </a-form-item>
      <a-form-item label="预览">
        <div class="bg-#f6f7fb border-rd-4 p-4">
          <div class="max-w-240">
            <link-item :item="form" />
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import LinkItem from '../link-item/index.vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import type { LinkDto } from '../../interface';
import { message as toast } from 'ant-design-vue';
import { http } from '@/utils';
import { ApiLink } from '@/apis';
import { useLink } from '../../hooks/link';

const { linkInfo } = useLink()
const emits = defineEmits(['refresh'])
const initFormData = () => ({
  url: '',
  name: '',
  backgroundColor: '',
  iconText: ''
})
const form = reactive(initFormData())
watch(() => linkInfo.form.show, val => {
  const { id, url, name, backgroundColor, iconText } = linkInfo.form.current
  if (val && id) {
    form.url = url || ''
    form.name = name || ''
    form.backgroundColor = backgroundColor || ''
    form.iconText = iconText || ''
  }
})
const isEdit = computed(() => !!linkInfo.form.current.id)
const colorList = [ '#1681ff', '#fbbe23', '#fc4548', '#4b3c36', '#7dac88', '#023373', '#c8ac70', '#372128', '#c82c34', '#054092', '#a3ddb9' ]
/**
 * 关闭表单
 */
function handleCancel() {
  linkInfo.form.show = false
  linkInfo.form.current = {}
  linkInfo.form.categoryId = ''
  Object.assign(form, initFormData())
}
/**
 * 提交表单
 */
const loading = ref(false)
function handleConfirm() {
  const { id } = linkInfo.form.current
  const typeName = `${isEdit.value ? '编辑' : '新增'}`
  if (!form.name) {
    toast.info('请输入名称')
    return
  }
  if (!form.url) {
    toast.info('请输入地址')
    return
  }
  // if (!form.backgroundColor) {
  //   toast.info('请选择图标颜色')
  //   return
  // }
  // if (!form.iconText) {
  //   toast.info('请输入图标文字')
  //   return
  // }
  const params: LinkDto = { ...form }
  if (id) {
    params.id = id
  }
  if (!params.backgroundColor) {
    params.backgroundColor = 'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),conic-gradient(from 190deg at 57% 40%,#8b6ff4 -96deg,#615ced 41deg,#615ced 207deg,#8b6ff4 264deg,#615ced 401deg)'
  }
  if (!params.iconText) {
    params.iconText = form.name.substring(0, 6)
  }
  loading.value = true
  http.post(
    id ? ApiLink.updateLink : ApiLink.addLink,
    {
      categoryId: linkInfo.form.categoryId,
      ...params
    }
  )
    .then(res => {
      loading.value = false
      const { success, message } = res
      if (!success) {
        toast.error(message || `${typeName}链接请求错误`)
        return
      }
      toast.success(`${typeName}成功`)
      handleCancel()
      emits('refresh')
    })
    .catch(error => {
      loading.value = false
      toast.error(error || `${typeName}链接请求错误`)
    })
}
</script>
<style scoped lang="scss">
.color-list {
  display: flex;
  column-gap: 10px;
}
.color-item {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .4s ease;
  &:hover {
    transform: scale(1.1);
  }
  .icon-checked {
    font-size: 10px;
    color: #fff;
  }
}
</style>