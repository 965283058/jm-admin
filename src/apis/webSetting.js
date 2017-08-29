import {get,post} from "./utils/index"
import * as urls from "./utils/urls"

export const getInfo=function (params) {
   return get(urls.WEB_SETTING_INFO,params)
}

export const edit=function (params) {
   return post(urls.WEB_SETTING_EDIT,params)
}

