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
