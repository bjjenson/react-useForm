export const validateForm = values => {
  if (values.first === 'Frank') {
    return {
      first: 'You cannot be Frank',
    }
  }
  return {}
}

export const validatePhone = (phone) => {
  if (phone.startsWith('123')) {
    return 'Phone cannot start with 123'
  }
  return ''
}
