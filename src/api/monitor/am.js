import request from '@/utils/request'

export function listAlerts(payload) {
    return request({ url: '/api/v1/am/alerts', method: 'post', data: payload })
}

export function listUpstreams() {
    return request({ url: "/api/v1/am/upstreams", method: 'get' })
}

export function deleteSilence(alertmanager, id) {
    return request({ url: '/api/v1/am/proxy/alertmanager/' + alertmanager + '/api/v2/silence/' + id, method: 'delete' })
}

export function listSilence(query) {
    var params = { "showExpired": 0, "sortReverse": 1 }
    if (query.searchTerm != undefined && query.searchTerm != "") {
        params["searchTerm"] = query.searchTerm
    }
    return request({ url: '/api/v1/am/silences', method: 'get', params: params })
}

export function ackAlert(alertmanager, payload) {
    return request({ url: '/api/v1/am/proxy/alertmanager/' + alertmanager + '/api/v2/silences', method: 'post', data: payload })
}