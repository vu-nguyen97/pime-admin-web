import request from '@/utils/request-mock'

export function getStatsInfo(query) {
  return request({
    url: '/admin-api/configs/upgrade-character',
    method: 'get',
    params: query
  })
}

export function updateStats(data) {
  return request({
    url: '/admin-api/configs/upgrade-character',
    method: 'post',
    data
  })
}
