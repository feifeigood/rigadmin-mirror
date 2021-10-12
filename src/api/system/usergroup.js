import request from '@/utils/request'

export function listUserGroup() {
    return request({
        url: '/api/v1/usergroups',
        method: 'get'
    })
}

export function getUserGroup(id) {
    return request({
      url: '/api/v1/usergroups/' + id,
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


export function updateUserGroup(data) {
    return request({
      url: `/api/v1/usergroups/${data.id}`,
      method: 'put',
      data: data
    })
  }
  
  export function delUserGroup(id) {
    return request({
      url: '/api/v1/usergroups/' + id,
      method: 'delete'
    })
  }

  export function addMembers(data) {
    return request({
        url: `/api/v1/usergroups/${data.ugId}/members`,
        method: 'post',
        data: data.payload
    })
  } 
  export function delMember(data) {
    return request({
      url: `/api/v1/usergroups/${data.ugId}/members`,
      method: 'delete',
      data: data.payload
    })
  }