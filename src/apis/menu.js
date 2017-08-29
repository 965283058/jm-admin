import {get,post} from "./utils/index"
import * as urls from "./utils/urls"

export const treeMenu=function (params) {
   return get(urls.MENU_TREE,params)
}

export const edit=function (params) {
   return post(urls.MENU_EDIT,params)
}
