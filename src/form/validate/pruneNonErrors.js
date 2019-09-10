const pruneArray = errors => {
  let hasError = false
  const results = errors.reduce((acc, value) => {
    const children = pruneObject(value)
    if (children && Object.keys(children).length > 0) {
      hasError = true
    }

    acc.push(children)
    return acc
  }, [])

  return hasError ? results : []
}

const pruneObject = errors => {
  if (!errors) return errors

  return Object.entries(errors).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      const children = pruneArray(value)
      if (children.length > 0) {
        acc[key] = children
      }
      if (value.error) {
        if (!acc[key]) acc[key] = []
        acc[key].error = value.error
      }
      return acc
    }

    if (typeof value === 'object') {
      const children = pruneObject(value)
      if (children && Object.keys(children).length > 0) {
        acc[key] = children
      }
    } else if (value) {
      acc[key] = value
    }

    return acc
  }, {})
}

export const pruneNonErrors = errors => {
  return pruneObject(errors)
}
