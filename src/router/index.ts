import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '舆情情感监测可视化平台',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/data-collection',
    name: 'DataCollection',
    component: () => import('@/views/DataCollection.vue'),
    meta: {
      title: '数据采集',
      requiresAuth: true
    }
  },
  {
    path: '/emotion-analysis',
    name: 'EmotionAnalysis',
    component: () => import('@/views/EmotionAnalysis.vue'),
    meta: {
      title: '情感分析',
      requiresAuth: true
    }
  },
  {
    path: '/evolution-analysis',
    name: 'EvolutionAnalysis',
    component: () => import('@/views/EvolutionAnalysis.vue'),
    meta: {
      title: '情感演化分析',
      requiresAuth: true
    }
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('@/views/SystemSecurity.vue'),
    meta: {
      title: '系统安全',
      requiresAuth: true,
      roles: ['admin']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '高校舆情情感演化分析系统'
  
  // 检查是否需要认证
  const isAuthenticated = true // 这里应该从store获取
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router