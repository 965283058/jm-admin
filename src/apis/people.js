import {get,post} from "./utils/index"
import * as urls from "./utils/urls"

export const list=function (params) {
   return get(urls.PEOPLE_LIST,params)
}

export const edit=function (params) {
   return post(urls.PEOPLE_EDIT,params)
}

export const del=function (params) {
   return post(urls.PEOPLE_DEL,params)
}