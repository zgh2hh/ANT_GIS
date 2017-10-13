import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from './store'
import root from '@/router/index.vue'
import index from '@/features/index/router'
import login from '@/features/login/index'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: root,
      redirect: '/index',
      children: [
        index
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
  mode: 'history'
})

// 同步store和路由
sync(store, router)

export default router
