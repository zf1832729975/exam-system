import Vue from 'vue'
import router from '@/router.js'
import store from '@/store'
import App from './App.vue'
import '@/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpRequest from '@/utils/httpRequest'
import cloneDeep from 'lodash/cloneDeep'
Vue.config.productionTip = false

// 保存整站vuex本地储存初始状态
// window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

Vue.directive('delHtmlTag', {   // 去掉html标签
    bind: function (el, binding, vnode) {
        return binding.value.replace(/<[^>]+>/g, "");
    },
})
/**
 * 把数字转换为大写字母 1 => A, 2 => B
 * @param {number} num 
 */
function numberToUpperCase(num) {
    return String.fromCharCode(64 + parseInt(num))
}
/**
 * 把数字转换为难易度 1 => 简单, 2 => 一般
 * @param {number} num 
 */
function numberToDifficult(num) {
    let arr = ['简单', '一般', '困难']
    return arr[num - 1]
}
/**
 *  去掉html标签
 * @param {string} str 
 */
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
}
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.numberToUpperCase = numberToUpperCase
Vue.prototype.numberToDifficult = numberToDifficult
Vue.prototype.delHtmlTag = delHtmlTag

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
