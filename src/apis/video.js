import {get, post} from "./utils/index"
import * as urls from "./utils/urls"


export const edit = function (params) {
    return post(urls.VIDEO_EDIT, params, {timeout: 1000 * 60 * 60 * 6})
}
export const del = function (params) {
    return post(urls.VIDEO_DEL, params)
}