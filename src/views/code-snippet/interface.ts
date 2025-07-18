export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  content: string;
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'vue' | 'python' | 'java';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  previewImage?: string; // 代码片段截图URL
}

export type SnippetForm = Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>;