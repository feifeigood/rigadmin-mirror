import request from '@/utils/request'

// 登录方法
export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/api/v1/self/info",
    method: "get"
  }).then(response => {
    return {
      "msg": "操作成功",
      "code": 200,
      "permissions": [
        "*:*:*"
      ],
      "roles": [
        response.roles[0].name,
      ],
      "user": {
        "userId": response.uid,
        "userName": response.username,
        "avatar": response.avatar | "",
      }
    }
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}