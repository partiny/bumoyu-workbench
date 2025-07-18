import { defineStore } from 'pinia';
import type { CodeSnippet } from '../interface';

export const useSnippetStore = defineStore('snippet', {
  state: () => ({
    snippets: [] as CodeSnippet[],
  }),
  actions: {
    addSnippet(snippet: CodeSnippet) {
      this.snippets.unshift(snippet);
      this.saveToLocalStorage();
    },
    updateSnippet(id: string, updatedSnippet: Partial<CodeSnippet>) {
      const index = this.snippets.findIndex(s => s.id === id);
      if (index !== -1) {
        this.snippets[index] = { ...this.snippets[index], ...updatedSnippet, updatedAt: new Date() };
        this.saveToLocalStorage();
      }
    },
    deleteSnippet(id: string) {
      this.snippets = this.snippets.filter(s => s.id !== id);
      this.saveToLocalStorage();
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('codeSnippets');
      if (saved) {
        this.snippets = JSON.parse(saved);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('codeSnippets', JSON.stringify(this.snippets));
    },
    // 生成代码预览图（实际项目中应调用后端API）
    generatePreviewImage(content: string): string {
      console.log('content', content)
      // 这里使用占位图，实际项目中应生成真实截图
      return '/src/assets/images/code-placeholder.png';
    }
  }
});

// 初始化时加载数据
const store = useSnippetStore();
store.loadFromLocalStorage();