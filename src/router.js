import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from './store'
import main from '@/router/index.vue'
import nutrition from '@/features/nutrition/router'
import login from '@/features/login/index'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      redirect: '/nutrition',
      children: [
        nutrition
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
