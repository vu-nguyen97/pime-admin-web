import request from '@/utils/request-mock'

export function getCCU() {
  return request({
    url: '/admin-api/stats/ccu',
    method: 'get'
  })
}
