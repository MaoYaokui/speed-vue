import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: app => app(App)
}).$mount('#app')
