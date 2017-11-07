import Vue from 'vue'
import App from './App'
import Http from 'vue-http'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import {Loading} from 'element-ui';
import { Message } from 'element-ui';
Vue.prototype.$loading = loading
Vue.loading=loading
Vue.use(ElementUI)
Vue.use(Http, {
    duration:1,
    root: '',
    timeout: 15000,
    loading: (bool)=> {
        Vue.loading(bool)
    },
    error: (msg,gg)=> {
        Message({
            type: 'error',
            message: msg,
            duration: 0,
            showClose:true
        })
    }
})

new Vue({
    store,
    router,
    ...App
}).$mount('#app')


function loading(show, text) {
    if (show) {
        this._loading = Loading.service({fullscreen: true, text: text})
    } else {
        this._loading&&this._loading.close()
    }
}

