import moment from 'moment'
// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} str
 */
export function capitalizeWord(str) {
  return !str ? str : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getLabelFromCamelCaseStr(str, toUpper = true) {
  if (!str) return str

  let results = ''
  let i = 0
  while (i < str.length) {
    const character = str.charAt(i)
    if (!i) {
      results += character.toUpperCase()
    } else if ('0123456789'.includes(character)) {
      results += character
    } else if (character === character.toUpperCase()) {
      const newChar = toUpper ? character : character.toLowerCase()
      results = results + ' ' + newChar
    } else {
      results += character
    }
    i++
  }
  return results
}

export const getLabelFromStr = (str) => {
  if (typeof str !== 'string' || !str) return str

  let results = str
  if (str.toUpperCase() === str) {
    results = capitalizeWord(str)

    if (results.includes('_')) {
      results = results.replaceAll('_', ' ')
    }
  } else {
    results = getLabelFromCamelCaseStr(str, false)
  }

  return results
}

export function dateFormatter(date) {
  return moment(date).format('DD-MM-YYYY, HH:mm:ss')
}
