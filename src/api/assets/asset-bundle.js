import request from '@/utils/request-mock'

export function getAssets(query) {
  return request({
    url: '/moon-api/asset-bundles',
    method: 'get',
    params: query
  })
}

export function uploadAsset(formData) {
  return request.post('/moon-api/asset-bundles/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
