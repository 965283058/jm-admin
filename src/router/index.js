import Vue from 'vue'
import routes from './map'
import Router from 'vue-router'
Vue.use(Router)
let isFirst = true
let router = new Router({
    mode: 'hash',
    routes: Object.keys(routes).reduce((previous, current) => {
        return (previous.push({path: current, ...routes[current]}), previous)
    }, []),
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    }
})

router.beforeEach(({matched,path}, from, next) => {
    if (isFirst && path != "/") {
        isFirst = false
        if (path != "/login"&&path != "/updatePwd") {
            router.replace("/wecome")
        }
    }
    isFirst = false
    matched.filter(({meta}) => meta.title).map(({meta}) => {
        document.title = meta.title
    })
    next()
})

export default router
