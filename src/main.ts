import '@/assets/main.scss'
import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import VContextMenu from '@/directives/context-menu/context-menu'

const app = createApp(App)
app.directive('context-menu', VContextMenu)
app
  .use(createPinia())
  .use(router)
  .use(Antd)
  .mount('#app')
