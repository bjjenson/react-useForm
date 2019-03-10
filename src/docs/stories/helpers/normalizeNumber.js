export const extractNumber = value => {
  if (!value) {
    return value
  }
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value.replace(/[^\d]/g, '')
}

export const normalizeNumber = value => {
  const extract = extractNumber(value)
  if (extract !== '') {
    return Number(extract)
  }
  return extract
}
