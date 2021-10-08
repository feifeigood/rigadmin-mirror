import request from '@/utils/request'

export function listRole(query) {
  return request({
    url: '/api/v1/roles',
    method: 'get',
    params: query
  })
}

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params: query
  })
}


// 新增用户
export function addUser(data) {
  return request({
    url: '/api/v1/users',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: `/api/v1/users/${data.uid}`,
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}


// 用户密码重置
export function resetUserPwd(uid, password) {
  return request({
    url: `/api/v1/users/${uid}/password`,
    method: 'put',
    data: {
      new: password
    }
  })
}

// 用户状态修改
export function changeUserStatus(uid) {
  return request({
    url: `/api/v1/users/${uid}/toggle`,
    method: 'put'
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    old: oldPassword,
    new: newPassword
  }
  return request({
    url: '/api/v1/self/password',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/api/v1/self/info',
    method: 'get'
  })
}
