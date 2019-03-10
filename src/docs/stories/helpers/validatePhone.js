export const validatePhone = (phone) => {
  const rawValue = phone.replace(/\./g, '')
  console.log(rawValue, rawValue.length)
  if (rawValue.length !== 10) {
    return 'Phone must be 10 digits long'
  }
  return ''
}
