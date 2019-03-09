const extractNumber = value => {
  if (!value) {
    return value
  }
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value.replace(/[^\d]/g, '')
}


const dot = num => {
  return (num && num.length > 0) ? `.${num}` : ''
}

export const normalizePhone = input => {
  const phone = extractNumber(input)

  let number = phone.slice(6, 10)
  let prefix = phone.slice(3, 6)
  let areaCode = phone.slice(0, 3)

  return `${areaCode}${dot(prefix)}${dot(number)}`

}
