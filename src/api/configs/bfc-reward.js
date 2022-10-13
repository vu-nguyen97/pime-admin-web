import request from '@/utils/request-mock'

export function fetchList(query) {
  return request({
    url: '/admin-api/configs/bfc-reward',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/admin-api/configs/bfc-reward',
    method: 'post',
    data
  })
}
