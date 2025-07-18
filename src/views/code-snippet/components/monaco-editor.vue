<template>
  <div class="monaco-editor-wrap">
    <header class="monaco-editor-header">
      <a-select
        v-model:value="currentLanguage"
        class="monaco-editor-select"
        :dropdownStyle="dropdownStyle"
        placeholder="语言"
        size="small"
      >
        <a-select-option
          v-for="item in MECONFIG.languageList"
          class="monaco-editor-select-option"
          :key="item"
          :value="item"
        >{{ item }}</a-select-option>
      </a-select>
      <a-select
        v-model:value="currentTags"
        class="monaco-editor-select"
        :dropdownStyle="dropdownStyle"
        mode="multiple"
        max-tag-count="responsive"
        placeholder="标签"
        size="small"
      >
        <a-select-option
          v-for="item in MECONFIG.tagList"
          :key="item.value"
          :value="item.value"
        >{{ item.label }}</a-select-option>
      </a-select>
    </header>
    <div ref="monacoRef" class="monaco-editor"></div>
  </div>
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
    default: 'typescript'
  },
  tags: {
    type: Array,
    default: () => []
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  height: {
    type: [String, Number],
    default: '500px'
  }
});

const emit = defineEmits([
  'update:modelValue',
  'update:language',
  'update:tags'
]);
const content = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})
const currentLanguage = computed({
  get: () => props.language,
  set: (val) => {
    emit('update:language', val);
  }
})
const currentTags = computed({
  get: () => props.tags,
  set: (val) => {
    emit('update:tags', val);
  }
})

// 选择器下拉框样式
const dropdownStyle = {
  backgroundColor: '#2a333e',
  color: '#fff'
}

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
      language: currentLanguage.value || 'typescript',
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
.monaco-editor-select-option {
  color: rgba(255, 255, 255, .7)!important;
  &.ant-select-item-option-active {
    background-color: #3b434d!important;
  }
  /* 4596ff */
  &.ant-select-item-option-selected {
    background-color: transparent!important;
    color: #4596ff!important;
  }
}
</style>
<style scoped lang="scss">
.monaco-editor-wrap {
  padding-left: 10px;
}
.monaco-editor-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #18212d;
  padding: 0 10px;
}
.monaco-editor-select {
  width: 100px;
}
:deep(.monaco-editor-select) {
  .ant-select-selector {
    background-color: #343c47;
    color: rgba(255, 255, 255, .7);
    border-radius: 0;
    border: none;
  }
  .ant-select-selection-item {
    color: rgba(255, 255, 255, .7);
  }
  /* ant-select-dropdown */
}
.monaco-editor {
  height: v-bind(height);
  overflow: hidden;
}
</style>