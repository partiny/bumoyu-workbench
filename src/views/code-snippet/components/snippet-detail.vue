<template>
  <a-modal
    v-model:open="visible"
    :title="snippet?.title || '代码详情'"
    width="80%"
    :footer="null"
    @cancel="close"
  >
    <div class="snippet-detail">
      <div class="editor-container">
        <MonacoEditor
          v-model:modelValue="editingContent"
          :language="snippet?.language || 'typescript'"
          :height="'60vh'"
          v-if="snippet"
        />
      </div>
      
      <div class="actions">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="save" :loading="saving">保存</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MonacoEditor from './monaco-editor.vue';
import type { CodeSnippet } from '../interface';
import { useSnippetStore } from '../hooks/use-snippet';

const props = defineProps<{
  snippet: CodeSnippet | null;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'saved']);
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const snippetStore = useSnippetStore();
const editingContent = ref('');
const saving = ref(false);

watch(() => props.snippet, (newVal) => {
  if (newVal) {
    editingContent.value = newVal.content;
  }
}, { immediate: true });

const save = async () => {
  if (!props.snippet) return;
  
  saving.value = true;
  try {
    snippetStore.updateSnippet(props.snippet.id, {
      content: editingContent.value
    });
    emit('saved');
    close();
  } finally {
    saving.value = false;
  }
};

const close = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.snippet-detail {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.editor-container {
  flex: 1;
  min-height: 0;
}

.actions {
  margin-top: 16px;
  text-align: right;
}
</style>