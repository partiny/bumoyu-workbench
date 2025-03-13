<template>
  <a-drawer
    :visible="previewVisible"
    title="待办详情"
    placement="right"
    :closable="false"
    width="500px"
    @close="handleFormClose"
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
    <a-row class="mb-10">
      <a-col :span="5">待办标题</a-col>
      <a-col :span="19">{{ form.title ?? '-' }}</a-col>
    </a-row>
    <a-row class="mb-10">
      <a-col :span="5">待办类型</a-col>
      <a-col :span="19">{{ getTodoTypeName(form.type) }}</a-col>
    </a-row>
    <a-row class="mb-10">
      <a-col :span="5">待办内容</a-col>
      <a-col :span="19">{{ form.content || '-' }}</a-col>
    </a-row>
    <a-row class="mb-10">
      <a-col :span="5">日期时间</a-col>
      <a-col :span="19">{{ form.rangeTime?.length ? `${form.rangeTime[0]} - ${form.rangeTime[1]}` : '-' }}</a-col>
    </a-row>
    <a-row class="mb-10">
      <a-col :span="5">状态</a-col>
      <a-col :span="19">
        <a-tag v-if="form.status === 'pending'">待定</a-tag>
        <a-tag v-else-if="form.status === 'completed'" color="success">已完成</a-tag>
        <a-tag v-else-if="form.status === 'archived'" color="process">已归档</a-tag>
      </a-col>
    </a-row>
    <a-row class="mb-10">
      <a-col :span="5">优先级</a-col>
      <a-col :span="19">{{ getTodoPriorityName(form.priority) }}</a-col>
    </a-row>
    <template #footer>
      <div class="flex justify-end gap-10">
        <a-button type="primary" danger :loading="loading" @click="handleFormDelete">删除待办</a-button>
        <a-button type="primary" @click="handleFormEdit(form)">编辑待办</a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { createVNode, h, ref } from 'vue';
import useForm from '../hooks/use-form';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { http } from '@/utils';
import { ApiTodo } from '@/apis'
import { Modal, message as toast } from 'ant-design-vue';
import useTodo from '../hooks/use-todo';

const { previewVisible, form, handleFormEdit, resetForm } = useForm()
const {
  initTodo,
  getTodoTypeName,
  getTodoStatusName,
  getTodoPriorityName
} = useTodo()
const loading = ref(false)

/**提交表单 */
function handleFormDelete() {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定删除当前待办事项吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      loading.value = true
      http.post(ApiTodo.deleteTodo, { id: form.id })
        .then(res => {
          loading.value = false
          const { success, message } = res
          if (!success) {
            toast.error(message || '删除待办请求错误')
            return
          }
          toast.success(`删除待办成功`)
          handleFormClose()
          initTodo()
        })
        .catch(error => {
          loading.value = false
          toast.error(error || '删除待办请求错误')
        })
    }
  });
}
/**关闭抽屉 */
function handleFormClose() {
  previewVisible.value = false
  resetForm()
}
</script>
<style scoped lang="scss">

</style>