

<template>
  <!-- 新增/编辑代码片段抽屉 -->
  <a-drawer
    v-model:open="visible"
    title="新增代码片段"
    placement="right"
    :width="800"
    :closable="false"
    @close="onClose"
  >
    <a-form
      :model="form"
      label-align="left"
      :colon="false"
    >
      <a-form-item
        label="标题"
        :label-col="{ span: 3 }"
        required
      >
        <a-input
          v-model:value="form.title"
          placeholder="输入片段标题"
        />
      </a-form-item>
      <a-form-item
        label="代码内容"
        :label-col="{ span: 24 }"
        required
      >
        <monaco-editor
          v-model="form.content"
          v-model:language="form.language"
          v-model:tags="form.tags"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <footer class="flex justify-end gap-col-20">
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </footer>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { computed, reactive } from "vue"
import MonacoEditor from "./monaco-editor.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible'])
const visible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})
const formInit = () => ({
  title: '',
  content: '',
  language: '',
  tags: []
})
const form = reactive(formInit())


function onClose() {
  visible.value = false;
  Object.assign(form, formInit())
}

function onSubmit() {

}
</script>
<style scoped lang="scss">

</style>