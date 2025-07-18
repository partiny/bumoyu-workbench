
import type { editor } from 'monaco-editor'

const MECONFIG = {
  defultConfig: {
    overviewRulerBorder: false, // 滚动是否有边框
    minimap: { // 关闭代码缩略图
      enabled: false // 是否启用预览图
    },
    automaticLayout: true, // 自动布局
    fontSize: 14,
    lineNumbers: 'on' as editor.LineNumbersType, // 控制行号的显隐
    scrollBeyondLastLine: false, // 禁用额外滚动区
    // wordWrap: 'on',
    scrollbar: {
      verticalScrollbarSize: 4, // 垂直滚动条宽度，默认px
      horizontalScrollbarSize: 4 // 水平滚动条高度
    },
    contextmenu: false, // 禁用右键菜单
    readOnly: false, // 是否只读
    value: '', // 默认值
    language: 'typescript', // 默认语言
    theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
  },
  /**语言列表 */
  languageList: [
    'typescript',
    'javascript',
    'css',
    'html',
    'json',
    'scss',
    'less',
    'markdown',
    'plaintext',
    'java',
    'mysql',
    'sql',
    'python',
    'redis',
    'dockerfile'
  ],
  /**常用标签列表 */
  tagList: [
    { label: 'Vue3', value: 'vue3' },
    { label: 'Vue2', value: 'vue2' },
  ]
}

export default MECONFIG