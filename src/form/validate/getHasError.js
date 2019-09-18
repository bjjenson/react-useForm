const iterateArray = errorTree => {
  for (const value of errorTree) {
    if (iterateObj(value)) return true
  }

  return false
}


const iterateObj = errorTree => {
  for (const value of Object.values(errorTree)) {
    let isError

    if (Array.isArray(value)) {
      isError = value.error || iterateArray(value)
    } else if (typeof value === 'object') {
      isError = iterateObj(value)
    } else {
      isError = Boolean(value)
    }

    if (isError) return true
  }
  return false
}

export const getHasError = errorTree => {
  return iterateObj(errorTree)
}
