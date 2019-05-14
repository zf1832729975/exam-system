import Vue from 'vue'
import VueRouter from 'vue-router'
import { clearLoginInfo } from '@/utils'

Vue.use(VueRouter)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
let __import
if (process.env.NODE_ENV == 'development') {
    __import = file => require('@/views/' + file + '.vue').default
} else {
    __import = file => () => import('@/views/' + file + '.vue')
}
const _import = __import

const routes = [
    // { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
    // { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
    { path: '*', redirect: '/404', hidden: true },
    { path: '/login', component: _import('common/login') },
    { path: '/404', component: _import('common/404') },
    // { path: '/question/add', component: _import('question/add') },
    {
        path: '/',
        component: _import('main'),
        children: [
            // { path: 'home', component: _import('main') },
            { path: 'question', component: _import('question/index') },
            { path: 'question/add', component: _import('question/add') },
            { path: 'stu', component: _import('student/index') },
            { path: 'paper', component: _import('paper/index') },
            { path: 'setting', component: _import('common/setting')},
            { path: 'teacher', component: _import('teacher/index')}
        ]
        // beforeEnter (to, from, next) {
        //     let token = sessionStorage.getItem('token')
        //     if (!token || !/\S/.test(token)) {
        //         clearLoginInfo()
        //         next({ path: '/login' })
        //     } else {
        //         next()
        //     }
        // }
    }
]

const router = new VueRouter({
    // mode: 'hash',
    mode: 'history',
    routes
})
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token')
    if (to.path !== '/404' && to.path !== '/login' && (!token || !/\S/.test(token))) {
        if(to.path !== '/') {
            alert('请登录')
        }
        clearLoginInfo()
        next('/login')
    } else {
        next()
    }
})
export default router