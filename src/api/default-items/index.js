import request from '@/utils/request-mock'

export function getDefaultItems(params) {
  return request({
    url: '/admin-api/default-items',
    method: 'get',
    params
  })
}

export function deleteItemById(id) {
  return request({
    url: `/admin-api/default-items/${id}`,
    method: 'delete'
  })
}

export function createItem(data) {
  return request({
    url: '/admin-api/default-items',
    method: 'post',
    data
  })
}

export function editItem(data) {
  return request({
    url: '/admin-api/default-items',
    method: 'put',
    data
  })
}
