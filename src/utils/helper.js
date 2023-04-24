import { getLabelFromStr } from './format'
import { SORT_TYPES, ASC } from '../constants/constants'

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

export function sortString(attr) {
  if (!attr) {
    return () => 1 // keep position of current data
  }

  // https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
  return (a, b) => ('' + a[attr]).localeCompare(b[attr])
}

export const sortNumber = (a, b, getField) => {
  if (!getField) return true

  const el1 = getField(a)
  const el2 = getField(b)
  const aData = el1 === 0 ? 0 : el1 || -1
  const bData = el2 === 0 ? 0 : el2 || -1
  return aData - bData
}

export function sortBool(attr) {
  if (!attr) {
    return () => {}
  }

  return (a, b) => Number(a[attr]) - Number(b[attr])
}

export const sortTableMultiple = (listData, sortData, SortMap = []) => {
  if (!Object.keys(sortData || {}).length) {
    return listData
  }

  const listSort = []
  for (const [key, value] of Object.entries(sortData)) {
    if (!value) continue
    listSort.push({ sortType: value, sortBy: key })
  }

  return listData.sort((a, b) => {
    const listNumber = listSort.map(({ sortType, sortBy }, idx) => {
      const activedSort = SortMap.find(el => el.field === sortBy)

      let aData = a[sortBy]
      let bData = b[sortBy]
      if (!activedSort) return 0

      if (activedSort.getField) {
        aData = activedSort.getField(a)
        bData = activedSort.getField(b)
      }

      let results = 0
      switch (activedSort.type) {
        case SORT_TYPES.string:
          if (sortType === ASC) {
            results = ('' + aData).localeCompare(bData)
          } else {
            results = ('' + bData).localeCompare(aData)
          }
          break
        case SORT_TYPES.number:
        default:
          aData = aData === 0 ? 0 : aData || -Infinity
          bData = bData === 0 ? 0 : bData || -Infinity
          results = sortType === ASC ? aData - bData : bData - aData
          break
      }
      return results
    })

    const sorterResult = listNumber.find(el => el !== 0)
    return sorterResult || 0
  })
}

export function getActivedType(data, categoryValue) {
  if (!data?.length) return

  const activedData = data.find(el => el.category === categoryValue)
  if (!activedData?.types?.length) return

  return activedData.types.map(el => {
    return { label: getLabelFromStr(el), value: el }
  })
}
