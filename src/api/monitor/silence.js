import request from '@/utils/request'

export function listSilence(query) {
    var params = { "showExpired": 1, "sortReverse": 1 }
    if (query.searchTerm != undefined && query.searchTerm != "") {
        params["searchTerm"] = query.searchTerm
    }
    return request({ url: '/api/v1/am/silences', method: 'get', params: params })
}

