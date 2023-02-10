import request from '@/utils/request-mock'

export function login(data) {
  // console.log(data)

  // const payload = { 'email': data.username, 'password': data.password}

  // console.log(payload)

  return request({
    url: '/moon-api/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  // token = 'admin-token'
  return request({
    url: '/moon-api/auth/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/moon-api/auth/logout',
    method: 'post'
  })
}
