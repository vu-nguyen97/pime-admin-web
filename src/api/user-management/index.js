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

// APIs for DetailUser page
export function getUser(id) {
  return request({
    url: `/admin-api/accounts/${id}`,
    method: 'get'
  })
}

export function getSourcesAndSinks(params) {
  return request({
    url: '/admin-api/accounts/currency-mov',
    method: 'get',
    params
  })
}

export function getBanReasons() {
  return request({
    url: '/admin-api/accounts/ban/reasons',
    method: 'get'
  })
}

export function banUser(data) {
  return request({
    url: '/admin-api/accounts/ban',
    method: 'post',
    data
  })
}

export function changeCurrency(data) {
  return request({
    url: '/admin-api/accounts/c/p-or-m',
    method: 'post',
    data
  })
}

export function sendMessage(data) {
  return request({
    url: '/admin-api/accounts/pm',
    method: 'post',
    data
  })
}
