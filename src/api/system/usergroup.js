import request from '@/utils/request'

export function listUserGroup() {
    return request({
        url: '/api/v1/usergroups',
        method: 'get'
    })
}

export function createUserGroup(payload) {
    return request({
        url: '/api/v1/usergroups',
        method: 'post',
        data: payload
    })
}