import { getLabelFromStr } from './format'

export const getDrdFromObj = (objData, getKey = false) => {
  if (!Object.keys(objData || {}).length) return []

  const listData = getKey ? Object.keys(objData) : Object.values(objData)
  return listData.map(el => {
    return { label: getLabelFromStr(el), value: el }
  })
}

export function numberWithCommas(x) {
  if (!x) return 0

  if (Number(x) < 1) {
    return x
  }

  // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
  // return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","); Error in safari
  return x.toLocaleString('en-US')
}
