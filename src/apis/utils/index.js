import Vue from 'vue'
import router from "../../router/index"
import { stringify } from 'qs'
import { MessageBox } from 'element-ui'


var handleLogic = response => {
    if (response.code == 0) {
        return Promise.resolve(response.data)
    } else if (response.code == -100) {
        setTimeout(() => {
            MessageBox({
                title:'错误',
                type:'error',
                message: "您的登录已超时，请重新登录！",
                duration:0,
                callback: () => {
                    router.replace("/login")
                }
            })
        }, 200)
    } else {
        return Promise.reject(response)
    }
}


var parseData = data => {
    if (data && data instanceof FormData) {
        return data
    }
    return stringify(data)
}

export const post = (url, data, opts = {}) => Vue.http.post(url, parseData(data), opts).then(handleLogic)
export const get = (url, data, opts = {}) => Vue.http.get(url, Object.assign({}, { params: data }, opts)).then(handleLogic)



