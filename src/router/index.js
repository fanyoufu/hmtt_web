import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login' // index.vue是可以省略的
import Layout from '@/views/layout' // index.vue是可以省略的

import Home from '@/views/home' // index.vue是可以省略的
// import Video from '@/views/video' // index.vue是可以省略的
// import Question from '@/views/question' // index.vue是可以省略的
// import User from '@/views/user' // index.vue是可以省略的
// import Search from '@/views/search' // index.vue是可以省略的
// import Result from '@/views/search/result.vue' //
// import Article from '@/views/article' //
// import Profile from '@/views/user/profile' //
// import Chat from '@/views/user/chat' //

// 为了解决在路由导航守卫中，发生路由跳转时的错误异常
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      // meta: 是属于路由对象的一部分。用来保存一些元信息
      //       它本身是一个对象，你可以自已去补充键值对
      { path: '', component: Home, meta: { isKeepAlive: true } }, // 默认显示的子路由
      { path: '/video', component: () => import('../views/video/index.vue') },
      { path: '/question', component: () => import('../views/question/index.vue') },
      { path: '/user', component: () => import('../views/user/index.vue') }
    ]
  },
  // 搜索中心
  {
    path: '/search',
    name: 'search',
    // component: Search,
    component: () => import('../views/search/index.vue')

  },
  // 搜索结果页
  {
    path: '/search/result',
    name: 'searchResult',
    // component: Result,
    component: () => import('../views/search/result.vue')
  },
  {
    path: '/article/:id',
    name: 'article',
    // component: Article
    component: () => import('../views/article/index.vue')

  },
  {
    path: '/user/profile',
    name: 'profile',
    // component: Profile,
    component: () => import('../views/user/profile.vue')

  },
  {
    path: '/user/chat',
    name: 'chat',
    // component: Chat
    component: () => import('../views/user/chat.vue')
  }

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
