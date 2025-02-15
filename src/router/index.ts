import LayoutDefault from '@/layout/layout-default.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/navigation',
      component: LayoutDefault,
      children: [
        {
          path: '/workbench',
          name: 'Workbench',
          component: () => import('@/views/page-workbench/page-workbench.vue'),
          meta: {
            title: '工作台'
          }
        },
        {
          path: '/navigation',
          name: 'Navigation',
          component: () => import('@/views/page-navigation/index.vue'),
          meta: {
            title: '导航'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/page-login/page-login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/regist',
      name: 'Regist',
      component: () => import('@/views/page-regist/page-regist.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/agreement',
      name: 'Agreement',
      component: () => import('@/views/page-agreement/page-agreement.vue'),
      meta: {
        title: '协议'
      }
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('@/views/page-password-reset/page-password-reset.vue'),
      meta: {
        title: '注册'
      }
    }
  ],
})

export default router
