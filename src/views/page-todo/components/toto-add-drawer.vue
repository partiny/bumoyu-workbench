<template>
  <a-drawer
    :visible="visible"
    :title="isEdit ? '编辑待办' : '新增待办'"
    placement="right"
    :closable="false"
    width="500px"
  >
    <template #extra>
      <a-button
        class="flex items-center justify-center"
        type="text"
        size="small"
        :icon="h(CloseOutlined)"
        @click="handleFormClose"
      />
    </template>
    <a-form
      ref="formRef"
      :model="form"
      @submit.prevent="handleFormSubmit"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-item 
        name="title" 
        label="待办标题"
        :rules="[{ required: true, message: '请输入待办标题' }]"
      >
        <a-input v-model:value="form.title" placeholder="请输入待办标题" />
      </a-form-item>

      <a-form-item label="待办类型" name="type">
        <a-select v-model:value="form.type" placeholder="请选择类型">
          <a-select-option value="work">工作</a-select-option>
          <a-select-option value="personal">个人</a-select-option>
          <a-select-option value="other">其他</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="待办内容" name="content">
        <a-textarea 
          v-model:value="form.content" 
          placeholder="请输入详细内容"
          :rows="4"
        />
      </a-form-item>

      <a-form-item label="日期时间" name="dateTime">
        <div class="flex gap-10">
          <a-date-picker 
            v-model:value="form.dateTime" 
            placeholder="选择日期"
            show-time
            :minute-step="30"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :show-now="false"
            :allow-clear="false"
          />
        </div>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="form.status" placeholder="请选择类型">
          <a-select-option value="pending">待定</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
          <a-select-option value="archived">已归档</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="优先级" name="priority">
        <a-radio-group v-model:value="form.priority">
          <a-radio value="low">低</a-radio>
          <a-radio value="medium">中</a-radio>
          <a-radio value="high">高</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="handleFormClose">取消</a-button>
        <a-button type="primary" @click="handleFormSubmit">确定</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { h, ref } from 'vue';
import useForm from '../hooks/use-form';
import { CloseOutlined } from '@ant-design/icons-vue';
import { http } from '@/utils';
import { ApiTodo } from '@/apis'
import { message as toast } from 'ant-design-vue';

const { visible, form, resetForm } = useForm()
const isEdit = ref(false)
const formRef = ref()
const loading = ref(false)
const emits = defineEmits(['refresh'])

/**提交表单 */
function handleFormSubmit() {
  formRef.value?.validate().then(() => {
    loading.value = true
    http.post(ApiTodo.addTodo, form)
      .then(res => {
        loading.value = false
        const { success, message } = res
        if (!success) {
          toast.error(message || `新增待办请求错误`)
          return
        }
        toast.success(`新增待办成功`)
        handleFormClose()
        emits('refresh')
      })
      .catch(error => {
        loading.value = false
        toast.error(error || `新增待办请求错误`)
      })
  }).catch(() => {})
}
/**关闭抽屉 */
function handleFormClose() {
  visible.value = false
  formRef.value?.resetFields()
  resetForm()
}
</script>
<style scoped lang="scss">

</style>