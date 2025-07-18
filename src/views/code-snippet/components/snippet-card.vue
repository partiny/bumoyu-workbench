<template>
  <a-card hoverable class="snippet-card">
    <template #cover>
      <img :src="snippet.previewImage" alt="代码预览" class="preview-image" />
    </template>
    
    <template #actions>
      <edit-outlined @click="emit('edit', snippet)" />
      <copy-outlined @click="emit('copy', snippet.content)" />
      <delete-outlined @click="emit('delete', snippet.id)" />
    </template>
    
    <a-card-meta :title="snippet.title" :description="truncate(snippet.description, 60)">
      <template #avatar>
        <div class="language-tag">{{ snippet.language }}</div>
      </template>
    </a-card-meta>
    
    <div class="tags">
      <a-tag v-for="tag in snippet.tags" :key="tag" color="blue">{{ tag }}</a-tag>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { CodeSnippet } from '../interface';

defineProps<{
  snippet: CodeSnippet;
}>();

const emit = defineEmits(['edit', 'copy', 'delete']);

const truncate = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
</script>

<style scoped>
.snippet-card {
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
}

.snippet-card:hover {
  transform: translateY(-5px);
}

.preview-image {
  height: 180px;
  object-fit: cover;
}

.language-tag {
  padding: 2px 8px;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.tags {
  margin-top: 8px;
}
</style>