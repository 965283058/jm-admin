import {get,post} from "./utils/index"
import * as urls from "./utils/urls"

export const list=function (params) {
   return get(urls.ADMIN_LIST,params)
}

export const edit=function (params) {
   return post(urls.ADMIN_EDIT,params)
}

export const del=function (params) {
   return post(urls.ADMIN_DEL,params)
}

export const resetPwd=function (params) {
   return post(urls.ADMIN_RESETPWD,params)
}
