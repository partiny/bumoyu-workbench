<template>
  <a-modal
    v-model:open="visible"
    :title="`${category.id ? '编辑' : '新增'}分类`"
    cancel-text="取消"
    ok-text="确认"
    :confirm-loading="loading"
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
          :maxlength="10"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { message as toast } from 'ant-design-vue';
import { http } from '@/utils';
import { ApiLink } from '@/apis';
import type { PropType, LinkTreeDto } from '../../interface';

const visible = defineModel('visible')
const props = defineProps({
  category: {
    type: Object as PropType<LinkTreeDto>,
    default: () => ({})
  }
})
const emits = defineEmits(['refresh'])
const form = reactive({
  name: ''
})
watch(() => visible.value, val => {
  if (val && props.category.id) {
    form.name = props.category.name || ''
  }
})

function handleCancel() {
  visible.value = false
  form.name = ''
}

const loading = ref(false)
function handleConfirm() {
  const { id } = props.category
  const typeName = `${id ? '编辑' : '新增'}`
  if (!form.name) {
    toast.info('请输入名称')
    return
  }
  const params: LinkTreeDto = { ...form }
  if (id) {
    params.id = id
  }
  loading.value = true
  http.post(
    id ? ApiLink.updateLinkCategory : ApiLink.addLinkCategory,
    { ...params }
  )
    .then(res => {
      loading.value = false
      const { success, message } = res
      if (!success) {
        toast.error(message || `${typeName}分类请求错误`)
        return
      }
      toast.success(`${typeName}成功`)
      handleCancel()
      emits('refresh')
    })
    .catch(error => {
      loading.value = false
      toast.error(error || `${typeName}分类请求错误`)
    })
}
</script>
<style scoped lang="scss">

</style>