// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router.js'
import store from './store'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

/* eslint-disable no-new */

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
