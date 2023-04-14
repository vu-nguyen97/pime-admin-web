import request from '@/utils/request-mock'

export function getAllUser(params) {
  return request({
    url: '/admin-api/accounts',
    method: 'get',
    params
  })
}

export function searchTopLevel(params) {
  return request({
    url: '/admin-api/accounts/top',
    method: 'get',
    params
  })
}
