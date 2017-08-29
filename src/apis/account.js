import {get,post} from "./utils/index"
import * as urls from "./utils/urls"


export const login=function (params) {
   return post(urls.LOGIN,params)
}

export const logout=function (params) {
   return post(urls.LOGOUT,params)
}
export const changePwd=function (params) {
   return post(urls.CHANGE_PWD,params)
}
