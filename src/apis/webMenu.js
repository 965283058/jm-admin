import {get,post} from "./utils/index"
import * as urls from "./utils/urls"



export const list=function (params) {
   return get(urls.WEBMENU_LIST,params)
}

export const edit=function (params) {
   return post(urls.WEBMENU_EDIT,params)
}