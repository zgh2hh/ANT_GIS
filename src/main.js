// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router.js'
import store from './store'
import ElementUI from 'element-ui'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
