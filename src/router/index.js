import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/hello', commponent: _import('HeloWorld') }
    ]
})

export default router