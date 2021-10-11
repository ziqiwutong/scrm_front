// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/vant.js'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.config.productionTip = false

// 请求头里配置token
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
