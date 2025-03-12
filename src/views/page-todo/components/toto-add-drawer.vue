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
          <a-select-option value="study">学习</a-select-option>
          <a-select-option value="life">生活</a-select-option>
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

      <a-form-item label="优先级" name="priority">
        <a-radio-group v-model:value="form.priority">
          <a-radio :value="1">高优先级</a-radio>
          <a-radio :value="0">普通</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="handleFormClose">取消</a-button>
        <a-button type="primary" html-type="submit">确定</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { h, ref } from 'vue';
import useForm from '../hooks/use-form';
import { CloseOutlined } from '@ant-design/icons-vue';

const { visible, form, resetForm } = useForm()
const isEdit = ref(false)
const formRef = ref()

/**提交表单 */
function handleFormSubmit() {
  formRef.value?.validate().then(() => {
    console.log(form)
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