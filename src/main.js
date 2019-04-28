import Vue from 'vue'
import router from '@/router'
import App from './App.vue'
import '@/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpRequest from '@/utils/httpRequest'
Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
