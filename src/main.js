import Vue from 'vue'
import router from '@/router'
import store from '@/store' 
import App from './App.vue'
import '@/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpRequest from '@/utils/httpRequest'
import cloneDeep from 'lodash/cloneDeep'
Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法

// 保存整站vuex本地储存初始状态
// window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
