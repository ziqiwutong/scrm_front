// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from "./store/index"
import Vant from 'vant'
// import './plugins/vant.js'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import 'vant/lib/index.css'


Vue.use(Vant)
Vue.prototype.$http = axios
Vue.config.productionTip = false
// Vue.use(Vant)
// 请求头里配置token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = store.state.token;
  // 在最后必须return config
  return config
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
