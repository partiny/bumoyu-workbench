<template>
  <div class="snippet-container">
    <a-page-header title="代码片段库" sub-title="收集常用代码片段">
      <template #extra>
        <a-button
          class="flex items-center"
          type="primary"
          @click="isSnippetEditDrawerShow = true"
        >
          <template #icon><PlusOutlined /></template>
          新建片段
        </a-button>
      </template>
    </a-page-header>

    <a-row :gutter="[16, 16]">
      <a-col
        v-for="snippet in snippets"
        :key="snippet.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <SnippetCard
          :snippet="snippet"
          @edit="handleEdit"
          @copy="handleCopy"
          @delete="handleDelete"
        />
      </a-col>
    </a-row>

    <!-- 空状态 -->
    <a-empty v-if="snippets.length === 0">
      <template #description>
        <div class="flex justify-center">
          暂无代码片段，去
          <span class="empty-add" @click="isSnippetEditDrawerShow = true">新建</span>
          一个吧~
        </div>
      </template>
    </a-empty>

    <!-- 创建新片段模态框 -->
    <a-modal
      v-model:open="showCreateModal"
      title="新建代码片段"
      width="80%"
      :footer="null"
    >
      <snippet-editor
        @submit="handleCreateSubmit"
        @cancel="showCreateModal = false"
      />
    </a-modal>

    <!-- 详情弹窗 -->
    <SnippetDetail
      :snippet="currentSnippet"
      :visible="showDetailModal"
      @update:visible="showDetailModal = $event"
      @saved="fetchSnippets"
    />
    <!-- 新增/编辑代码片段抽屉 -->
    <snippet-edit-drawer
      v-model:visible="isSnippetEditDrawerShow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import SnippetCard from './components/snippet-card.vue';
import SnippetDetail from './components/snippet-detail.vue';
import SnippetEditor from './components/snippet-editor.vue';
import { useSnippetStore } from './hooks/use-snippet';
import type { CodeSnippet } from './interface';
import SnippetEditDrawer from './components/snippet-edit-drawer.vue';

const snippetStore = useSnippetStore();
const snippets = ref<CodeSnippet[]>([]);
const showCreateModal = ref(false);
const showDetailModal = ref(false);
const currentSnippet = ref<CodeSnippet | null>(null);
const isSnippetEditDrawerShow = ref(false)

const fetchSnippets = () => {
  snippets.value = snippetStore.snippets;
};

onMounted(() => {
  fetchSnippets();
});

const handleEdit = (snippet: CodeSnippet) => {
  currentSnippet.value = snippet;
  showDetailModal.value = true;
};

const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    message.success('代码已复制到剪贴板');
  });
};

const handleDelete = (id: string) => {
  snippetStore.deleteSnippet(id);
  fetchSnippets();
  message.success('代码片段已删除');
};

const handleCreateSubmit = (snippet: CodeSnippet) => {
  snippetStore.addSnippet(snippet);
  fetchSnippets();
  showCreateModal.value = false;
  message.success('代码片段已创建');
};
</script>

<style scoped>
.snippet-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 100px);
}

.snippet-card {
  height: 100%;
}
.empty-add {
  cursor: pointer;
  margin: 0 4px;
  color: var(--qt-primary-color);
  &:hover {
    text-decoration: underline;
  }
}
</style>