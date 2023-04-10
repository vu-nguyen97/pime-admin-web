import { getLabelFromStr } from './format'

export const getDrdFromObj = (objData, getKey = false) => {
  if (!Object.keys(objData || {}).length) return []

  const listData = getKey ? Object.keys(objData) : Object.values(objData)
  return listData.map(el => {
    return { label: getLabelFromStr(el), value: el }
  })
}
