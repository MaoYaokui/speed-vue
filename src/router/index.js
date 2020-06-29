import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: {title: '首页', icon: 'dashboard'}
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    meta: {title: '用户管理', icon: 'user'},
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin'),
        meta: {title: '管理员管理', icon: 'user'}
      },
      {
        path: 'list',
        name: 'User',
        component: () => import('@/views/user'),
        meta: {title: '会员管理', icon: 'user'}
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: {title: '商品管理', icon: 'commodity'},
    children: [
      {
        path: 'cate',
        name: 'Cate',
        component: () => import('@/views/cate'),
        meta: {title: '商品分类', icon: 'table'}
      },
      {
        path: 'list',
        name: 'Product',
        component: () => import('@/views/product'),
        meta: {title: '商品列表', icon: 'nested'}
      }
    ]
  },

  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/list',
    name: 'Orders',
    meta: {title: '订单管理', icon: 'form'},
    children: [
      {
        path: 'list',
        name: 'Orders',
        component: () => import('@/views/orders'),
        meta: {title: '订单列表', icon: 'form'}
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('@/views/appointment'),
        meta: {title: '约课列表', icon: 'form'}
      },
    ]
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}

export default router
