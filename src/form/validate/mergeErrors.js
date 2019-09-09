const mergeArray = (fields, form) => {
  if (!fields) return form

  if (!Array.isArray(form)) {
    fields.error = form
    return fields
  }
  if (!Array.isArray(fields)) {
    form.error = fields
    return form
  }

  return form.reduce((acc, value, index) => {
    acc[index] = mergeObject(acc[index], value)

    return acc
  }, fields)
}

const mergeObject = (fields, form) => {
  if (!fields) return form
  if (!form) return fields

  return Object.entries(form).reduce((acc, [key, value]) => {

    if (Array.isArray(acc[key]) || Array.isArray(value)) {
      acc[key] = mergeArray(acc[key], value)
    } else {
      acc[key] = value
    }

    return acc
  }, fields)
}

export const mergeErrors = (fields, form) => {
  return mergeObject(fields, form)
}
