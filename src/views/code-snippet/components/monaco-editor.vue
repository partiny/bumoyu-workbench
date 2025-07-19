<template>
  <div ref="monacoRef" class="monaco-editor" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import * as monaco from 'monaco-editor';
import MECONFIG from '../monaco-editor-config';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'plaintext'
  },
  readOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:modelValue'
]);
const content = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const monacoRef = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

/**配置monaco editor工作环境 from: https://github.com/microsoft/monaco-editor/issues/4739 */
const ensureMonacoEnvironment = () => {
  self.MonacoEnvironment = {
    getWorkerUrl: () =>
      `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://unpkg.com/monaco-editor@0.50.0/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@0.50.0/min/vs/base/worker/workerMain.js');`)}`,
  };
};

ensureMonacoEnvironment()

// 初始化编辑器
onMounted(async () => {
  if (!monacoRef.value) return;
  
  try {
    editor = monaco.editor.create(monacoRef.value, {
      ...MECONFIG.defultConfig,
      value: content.value,
      language: props.language,
      readOnly: props.readOnly, // 是否只读
    });
    
    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || '';
      emit('update:modelValue', value);
    });
  } catch(error) {
    console.error('Monaco Editor初始化失败:', error);
  }
});

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue);
  }
});

// 监听语言变化
watch(() => props.language, (newLanguage) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel()!, newLanguage);
  }
});

// 清理资源
onBeforeUnmount(() => {
  editor?.dispose();
});
</script>

<style lang="scss">

</style>
<style scoped lang="scss">
.monaco-editor {
  height: 400px;
  overflow: hidden;
}
</style>