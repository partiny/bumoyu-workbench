<template>
  <div class="snippet-editor">
    <a-form :model="formState" layout="vertical">
      <a-form-item label="标题" required>
        <a-input v-model:value="formState.title" placeholder="输入片段标题" />
      </a-form-item>
      
      <a-form-item label="描述">
        <a-textarea v-model:value="formState.description" placeholder="输入片段描述" :rows="2" />
      </a-form-item>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="语言">
            <a-select v-model:value="formState.language">
              <a-select-option value="javascript">JavaScript</a-select-option>
              <a-select-option value="typescript">TypeScript</a-select-option>
              <a-select-option value="html">HTML</a-select-option>
              <a-select-option value="css">CSS</a-select-option>
              <a-select-option value="vue">Vue</a-select-option>
              <a-select-option value="python">Python</a-select-option>
              <a-select-option value="java">Java</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item label="标签">
            <a-select
              v-model:value="formState.tags"
              mode="tags"
              placeholder="添加标签"
              :token-separators="[',']"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-form-item label="代码内容" required>
        <MonacoEditor
          v-model:modelValue="formState.content"
          :language="formState.language"
          :height="'400px'"
        />
      </a-form-item>
    </a-form>
    
    <div class="actions">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="submit">保存</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MonacoEditor from './monaco-editor.vue';
import { v4 as uuidv4 } from 'uuid';
import type { CodeSnippet, SnippetForm } from '../interface';
import { useSnippetStore } from '../hooks/use-snippet';

const emit = defineEmits(['submit', 'cancel']);

const snippetStore = useSnippetStore();
const formState = ref<SnippetForm>({
  title: '',
  description: '',
  content: '',
  language: 'typescript',
  tags: [],
});

const submit = () => {
  if (!formState.value.title.trim() || !formState.value.content.trim()) {
    return;
  }
  
  const newSnippet: CodeSnippet = {
    id: uuidv4(),
    ...formState.value,
    previewImage: snippetStore.generatePreviewImage(formState.value.content),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  emit('submit', newSnippet);
  resetForm();
};

const cancel = () => {
  emit('cancel');
  resetForm();
};

const resetForm = () => {
  formState.value = {
    title: '',
    description: '',
    content: '',
    language: 'typescript',
    tags: [],
  };
};
</script>

<style scoped>
.snippet-editor {
  padding: 16px;
}

.actions {
  margin-top: 24px;
  text-align: right;
}
</style>