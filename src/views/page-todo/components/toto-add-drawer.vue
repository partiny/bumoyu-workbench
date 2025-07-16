<template>
  <a-drawer
    :visible="visible"
    :title="isEdit ? '编辑待办' : '新增待办'"
    placement="right"
    :closable="false"
    width="500px"
    :z-index="1001"
    :root-style="{
      zIndex: 1001
    }"
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
    <a-spin :spinning="loading">
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
          <a-input v-model:value="form.title" :maxlength="100" allow-clear placeholder="请输入待办标题" />
        </a-form-item>

        <a-form-item label="待办类型" name="type">
          <a-select v-model:value="form.type" placeholder="请选择类型">
            <a-select-option
              v-for="item in todoTypeList" 
              :key="item.code"
              :value="item.code"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="待办内容" name="content">
          <a-textarea 
            v-model:value="form.content" 
            placeholder="请输入详细内容"
            :rows="4"
          />
        </a-form-item>

        <a-form-item label="待办日期" name="rangeTime">
          <div class="flex gap-10">
            <a-range-picker 
              v-model:value="form.rangeTime" 
              :placeholder="['开始日期', '结束日期']"
              :show-time="{ format: 'HH:mm' }"
              :minute-step="30"
              :format="['YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm']"
              value-format="YYYY-MM-DD HH:mm"
              :show-now="false"
              :allow-clear="false"
            />
          </div>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="form.status" placeholder="请选择类型">
            <a-select-option
              v-for="item in todoStatusList" 
              :key="item.code"
              :value="item.code"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="优先级" name="priority">
          <a-radio-group v-model:value="form.priority">
            <a-radio
              v-for="item in todoPriorityList" 
              :key="item.code"
              :value="item.code"
            >{{ item.name }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <div class="flex justify-end gap-10">
        <a-button @click="handleFormClose">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleFormSubmit">确定</a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { computed, h, ref } from 'vue';
import useForm from '../hooks/use-form';
import { CloseOutlined, ZhihuCircleFilled } from '@ant-design/icons-vue';
import { http } from '@/utils';
import { ApiTodo } from '@/apis'
import { message as toast } from 'ant-design-vue';
import useTodo from '../hooks/use-todo';

const { visible, previewVisible, form, resetForm } = useForm()
const {
  initTodo,
  todoTypeList,
  todoPriorityList,
  todoStatusList
 } = useTodo()
const isEdit = computed(() => !!form.id)
const formRef = ref()
const loading = ref(false)

/**提交表单 */
function handleFormSubmit() {
  formRef.value?.validate().then(() => {
    loading.value = true
    const text = isEdit.value ? '编辑' : '新增'
    http.post(
      isEdit.value ? ApiTodo.updateTodo : ApiTodo.addTodo,
      {
        ...form,
        startTime: form.rangeTime?.[0] ?? null,
        endTime: form.rangeTime?.[1] ?? null
      }
    )
      .then(res => {
        loading.value = false
        const { success, message } = res
        if (!success) {
          toast.error(message || `${text}请求错误`)
          return
        }
        toast.success(`${text}成功`)
        handleFormClose()
        initTodo()
      })
      .catch(error => {
        loading.value = false
        toast.error(error || `${text}请求错误`)
      })
  }).catch(() => {})
}
/**关闭抽屉 */
function handleFormClose() {
  visible.value = false
  if (previewVisible.value) return
  formRef.value?.resetFields()
  resetForm()
}
</script>
<style scoped lang="scss">

</style>