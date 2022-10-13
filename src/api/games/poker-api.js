import request from '@/utils/request-mock'

export function fetchList(query) {
  return request({
    url: '/admin-api/games/poker/blind-levels',
    method: 'get',
    params: query
  })
}

export function update(id, data) {
  return request({
    url: '/admin-api/games/poker/blind-levels/' + id,
    method: 'put',
    data
  })
}
